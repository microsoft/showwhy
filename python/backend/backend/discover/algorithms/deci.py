import base64
import io
import logging
import math
import shutil
from typing import Any, List, Literal, Optional, Tuple, Union

import networkx
import numpy as np
import pandas as pd
import torch
from causica.datasets.dataset import Dataset
from causica.datasets.variables import Variables
from causica.models.deci.deci_gaussian import DECIGaussian
from causica.models.deci.generation_functions import ContractiveInvertibleGNN
from causica.utils.torch_utils import get_torch_device
from celery import uuid
from networkx.readwrite import json_graph
from pydantic import BaseModel

from backend.discover.algorithms.commons.base_runner import (
    CausalDiscoveryRunner,
    CausalGraph,
    ProgressCallback,
)
from backend.discover.model.causal_discovery import (
    CausalDiscoveryPayload,
    map_to_causica_var_type,
)

torch.set_default_dtype(torch.float32)


class DeciModelOptions(BaseModel):
    imputation: bool = False
    lambda_dag: float = 100.0
    lambda_sparse: float = 5.0
    tau_gumbel: float = 1.0
    var_dist_A_mode: Literal["simple", "enco", "true", "three"] = "three"
    imputer_layer_sizes: Optional[List[int]] = None
    mode_adjacency: Literal["upper", "lower", "learn"] = "learn"
    # TODO: Once pytorch implements opset 17 we can use nn.LayerNorm
    norm_layers: bool = False
    res_connection: bool = True
    encoder_layer_sizes: Optional[List[int]] = [32, 32]
    decoder_layer_sizes: Optional[List[int]] = [32, 32]
    cate_rff_n_features: int = 3000
    cate_rff_lengthscale: Union[int, float, List[float], Tuple[float, float]] = 1


# To speed up training you can try:
#  increasing learning_rate
#  increasing batch_size (reduces noise when using higher learning rate)
#  decreasing max_steps_auglag (go as low as you can and still get a DAG)
#  decreasing max_auglag_inner_epochs
class DeciTrainingOptions(BaseModel):
    learning_rate: float = 3e-2
    batch_size: int = 512
    stardardize_data_mean: bool = False
    stardardize_data_std: bool = False
    rho: float = 10.0
    safety_rho: float = 1e13
    alpha: float = 0.0
    safety_alpha: float = 1e13
    tol_dag: float = 1e-3
    progress_rate: float = 0.25
    max_steps_auglag: int = 20
    max_auglag_inner_epochs: int = 1000
    max_p_train_dropout: float = 0.25
    reconstruction_loss_factor: float = 1.0
    anneal_entropy: Literal["linear", "noanneal"] = "noanneal"


class DeciPayload(CausalDiscoveryPayload):
    model_options: DeciModelOptions = DeciModelOptions()
    training_options: DeciTrainingOptions = DeciTrainingOptions()


class DeciRunner(CausalDiscoveryRunner):
    name = "DeciRunner"

    def __init__(self, p: DeciPayload, progress_callback: ProgressCallback = None):
        super().__init__(p, progress_callback)
        self._model_options = p.model_options
        self._training_options = p.training_options
        # make sure every run has its own folder
        self._deci_save_dir = f"CauseDisDECIDir/{uuid()}"

    def _build_causica_dataset(self) -> Dataset:
        numpy_data = self._prepared_data.to_numpy()
        data_mask = np.ones(numpy_data.shape)

        # TODO: mapping non binary and non continuous to continuous
        # columns for now, until we work around representing
        # categorical variables with ONNX
        variables = Variables.create_from_data_and_dict(
            numpy_data,
            data_mask,
            {
                "variables": [
                    {
                        "name": name,
                        "type": map_to_causica_var_type(self._nature_by_variable[name]),
                        "lower": self._prepared_data[name].min(),
                        "upper": self._prepared_data[name].max(),
                    }
                    for name in self._prepared_data.columns
                ]
            },
        )

        return Dataset(train_data=numpy_data, train_mask=data_mask, variables=variables)

    def _build_model(self, causica_dataset: Dataset) -> DECIGaussian:
        deci_model = DECIGaussian(
            "CauseDisDECI",
            causica_dataset.variables,
            self._deci_save_dir,
            get_torch_device("gpu"),
            **self._model_options.dict(),
        )
        constraint_matrix = self._build_constraint_matrix(
            self._prepared_data,
            tabu_child_nodes=self._constraints.causes,
            tabu_parent_nodes=self._constraints.effects,
            tabu_edges=self._constraints.forbiddenRelationships,
        )

        deci_model.set_graph_constraint(constraint_matrix)

        return deci_model

    def _build_constraint_matrix(
        self,
        data: pd.DataFrame,
        tabu_child_nodes: Optional[List[str]] = None,
        tabu_parent_nodes: Optional[List[str]] = None,
        tabu_edges: Optional[List[Tuple[str, str]]] = None,
    ) -> np.ndarray:
        """
        Makes a DECI constraint matrix from GCastle constraint format.

        Arguments:
            tabu_child_nodes: Optional[List[str]]
                nodes that cannot be children of any other nodes (root nodes)
            tabu_parent_nodes: Optional[List[str]]
                edges that cannot be the parent of any other node (leaf nodes)
            tabu_edge: Optional[List[Tuple[str, str]]]
                edges that cannot exist
        """
        constraint = np.full((len(data.columns), len(data.columns)), np.nan)
        name_to_idx = {name: i for (i, name) in enumerate(data.columns)}

        if tabu_child_nodes is not None:
            for node in tabu_child_nodes:
                idx = name_to_idx[node]
                constraint[:, idx] = 0.0

        if tabu_parent_nodes is not None:
            for node in tabu_parent_nodes:
                idx = name_to_idx[node]
                constraint[idx, :] = 0.0

        if tabu_edges is not None:
            for source, sink in tabu_edges:
                source_idx, sink_idx = name_to_idx[source], name_to_idx[sink]
                constraint[source_idx, sink_idx] = 0.0

        return constraint.astype(np.float32)

    def _get_adj_matrix(self, deci_model: DECIGaussian) -> np.ndarray:
        # The next two lines of code are the same as:
        # deci_graph = deci_model.networkx_graph()
        # but omit an assertion that the graph is a DAG.  This is so the calculation doesn't just
        # fail after 20 minutes due to a single bad edge.
        adj_matrix = deci_model.get_adj_matrix_tensor(
            do_round=False, samples=1, most_likely_graph=True
        )
        adj_matrix = adj_matrix.squeeze(0)
        adj_matrix = adj_matrix.detach().cpu().numpy().astype(np.float64)

        return adj_matrix

    def _compute_average_treatment_effect(
        self, model: DECIGaussian, causica_dataset: Dataset
    ) -> np.ndarray:
        train_data = pd.DataFrame(causica_dataset.train_data_and_mask[0])
        treatment_values = train_data.mean(0) + train_data.std(0)
        reference_values = train_data.mean(0) - train_data.std(0)
        ates = []

        for variable in range(treatment_values.shape[0]):
            intervention_idxs = torch.tensor([variable])
            intervention_value = torch.tensor([treatment_values[variable]])
            reference_value = torch.tensor([reference_values[variable]])

            logging.info(
                f"Computing the ATE between X{variable}={treatment_values[variable]} and X{variable}={reference_values[variable]}"
            )

            # This estimate uses 200k samples for accuracy. You can get away with fewer if necessary
            ate, _ = model.cate(
                intervention_idxs,
                intervention_value,
                reference_value,
                Ngraphs=1,
                Nsamples_per_graph=200,
                most_likely_graph=True,
            )
            ates.append(ate)

        ate_matrix = np.stack(ates)

        return ate_matrix

    def _build_onnx_model(
        self, deci_model: DECIGaussian, adj_matrix: np.ndarray
    ) -> bytes:
        num_columns = self._prepared_data.shape[1]
        intervention_mask = torch.cat(
            (
                torch.zeros(math.ceil(num_columns / 2), dtype=torch.bool),
                torch.ones(math.floor(num_columns / 2), dtype=torch.bool),
            ),
            0,
        )
        intervention_values = torch.rand(math.floor(num_columns / 2))
        # TODO: looks like onnx does not support categorical features
        # we should look into it
        gumbel_max_regions = torch.LongTensor(
            deci_model.variables.processed_cols_by_type["categorical"]
        )
        gt_zero_region = torch.LongTensor(
            [
                j
                for i in deci_model.variables.processed_cols_by_type["binary"]
                for j in i
            ]
        )
        deci_inference_inputs = (
            torch.rand([1, num_columns]),
            torch.from_numpy(adj_matrix).float(),
            intervention_mask,
            intervention_values,
            gumbel_max_regions,
            gt_zero_region,
        )
        input_names = [
            "X",
            "W_adj",
            "intervention_mask",
            "intervention_values",
            "gumbel_max_regions",
            "gt_zero_region",
        ]
        output_names = ["inference_results"]
        onnx_output = io.BytesIO()

        torch.onnx.export(
            torch.jit.script(deci_model.ICGNN),
            deci_inference_inputs,
            onnx_output,
            input_names=input_names,
            output_names=output_names,
            # opset_version=17, # TODO: Once pytorch implements opset 17 we can use nn.LayerNorm
            opset_version=11,
            export_params=True,
            dynamic_axes={"intervention_values": {0: "intervention_count"}},
        )

        return onnx_output.getvalue()

    def _build_labeled_graph(
        self, adj_matrix: np.ndarray, ate_graph: np.ndarray
    ) -> Any:
        deci_graph = networkx.convert_matrix.from_numpy_matrix(
            adj_matrix, create_using=networkx.DiGraph
        )
        deci_ate_graph = networkx.convert_matrix.from_numpy_matrix(
            ate_graph, create_using=networkx.DiGraph
        )
        labels = {
            i: self._prepared_data.columns[i]
            for i in range(len(self._prepared_data.columns))
        }

        for n1, n2, d in deci_graph.edges(data=True):
            # TODO: validate what to do when there is no edge in the ate graph
            #       currently returning weight 0
            ate = deci_ate_graph.get_edge_data(n1, n2, default={"weight": 0})["weight"]
            d["confidence"] = d.pop("weight", None)
            d["weight"] = ate

        return networkx.relabel_nodes(deci_graph, labels)

    def _build_causal_graph(
        self,
        onnx_model: bytes,
        labeled_graph: Any,
        adj_matrix: np.ndarray,
        ate_matrix: np.ndarray,
    ) -> CausalGraph:
        causal_graph = json_graph.cytoscape_data(labeled_graph)

        causal_graph["onnx"] = base64.b64encode(onnx_model)
        causal_graph["columns"] = [
            self._prepared_data.columns[i]
            for i in range(len(self._prepared_data.columns))
        ]
        causal_graph["confidence_matrix"] = adj_matrix.tolist()
        causal_graph["ate_matrix"] = ate_matrix.tolist()
        # TODO: we should evaluate whether this is necessary to keep or not
        #       in case we need to keep, reimplement it
        causal_graph["interpret_boolean_as_continuous"] = False
        causal_graph["has_weights"] = True
        causal_graph["has_confidence_values"] = True
        causal_graph["normalized_columns_metadata"] = self._normalized_columns_metadata

        return causal_graph

    def _do_causal_discovery(self) -> CausalGraph:
        # if the data contains only a single column,
        # let's return an empty graph
        if self._prepared_data.columns.size == 1:
            return self._get_empty_graph_json(self._prepared_data)

        causica_dataset = self._build_causica_dataset()

        deci_model = self._build_model(causica_dataset)

        deci_model.run_train(
            causica_dataset,
            self._training_options.dict(),
            lambda model_id, step, max_steps: self._report_progress(
                step * 100.0 / max_steps
            ),
        )

        adj_matrix = self._get_adj_matrix(deci_model)

        ate_matrix = self._compute_average_treatment_effect(deci_model, causica_dataset)

        deci_model.eval()

        causal_graph = self._build_causal_graph(
            self._build_onnx_model(deci_model, adj_matrix),
            self._build_labeled_graph(adj_matrix, ate_matrix),
            adj_matrix,
            ate_matrix,
        )

        self._report_progress(100.0)

        return causal_graph

    def do_causal_discovery(self) -> CausalGraph:
        try:
            return self._do_causal_discovery()
        finally:
            # cleanup deci save dir
            shutil.rmtree(self._deci_save_dir, ignore_errors=True)


#### Can be removed if https://github.com/microsoft/causica/pull/17 is approved/merged
def forward(
    self,
    Z: torch.Tensor,
    W_adj: torch.Tensor,
    intervention_mask: torch.Tensor,
    intervention_values: torch.Tensor,
    gumbel_max_regions: torch.Tensor,
    gt_zero_region: torch.Tensor,
):
    return self.simulate_SEM(
        Z,
        W_adj,
        intervention_mask,
        intervention_values,
        gumbel_max_regions,
        gt_zero_region,
    )


def simulate_SEM(
    self,
    Z: torch.Tensor,
    W_adj: torch.Tensor,
    intervention_mask: Optional[torch.Tensor] = None,
    intervention_values: Optional[torch.Tensor] = None,
    gumbel_max_regions: Optional[torch.Tensor] = None,
    gt_zero_region: Optional[torch.Tensor] = None,
):
    X = torch.zeros_like(Z)

    for _ in range(self.num_nodes):
        if intervention_mask is not None and intervention_values is not None:
            X[:, intervention_mask] = intervention_values.unsqueeze(0)
        X = self.f.feed_forward(X, W_adj) + Z
        if gumbel_max_regions is not None:
            for region in gumbel_max_regions:
                maxes = X[:, region].max(-1, keepdim=True)[0]
                X[:, region] = (X[:, region] >= maxes).float()
        if gt_zero_region is not None:
            X[:, gt_zero_region] = (X[:, gt_zero_region] > 0).float()

    if intervention_mask is not None and intervention_values is not None:
        X[:, intervention_mask] = intervention_values.unsqueeze(0)

    return X


ContractiveInvertibleGNN.forward = forward
ContractiveInvertibleGNN.simulate_SEM = simulate_SEM
