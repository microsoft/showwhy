import base64
import io
import math
from typing import List, Literal, Optional, Tuple, Union

import networkx
import numpy as np
import pandas as pd
import torch
from causica.models.deci.deci_gaussian import DECIGaussian
from causica.models.deci.generation_functions import ContractiveInvertibleGNN
from causica.utils.torch_utils import get_torch_device
from networkx.readwrite import json_graph
from pydantic import BaseModel

from backend.discover.algorithms.base import CausalDiscoveryRunner, CausalGraph
from backend.discover.base_payload import CausalDiscoveryPayload
from backend.discover.pandas_dataset_loader import PandasDatasetLoader

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
    deci_model_options: DeciModelOptions = DeciModelOptions()
    deci_training_options: DeciTrainingOptions = DeciTrainingOptions()


class DeciRunner(CausalDiscoveryRunner):
    def __init__(self, p: DeciPayload):
        super().__init__(p)
        self._deci_model_options = p.deci_model_options
        self._deci_training_options = p.deci_training_options

    def do_causal_discovery(self) -> CausalGraph:
        dataset_loader = PandasDatasetLoader("")
        azua_dataset = dataset_loader.split_data_and_load_dataset(
            self._prepared_data, 0.5, 0, 0
        )  # 0.1, 0.1, 0)

        interpret_boolean_as_continuous = True
        for var in azua_dataset.variables:
            if interpret_boolean_as_continuous:
                var.type = "continuous"
            if var.type == "continuous":
                if var.lower < 0:
                    var.lower = -1
                else:
                    var.lower = 0
                var.upper = 1

        torch_device = get_torch_device("gpu")
        deci_model = DECIGaussian(
            "CauseDisDECI",
            azua_dataset.variables,
            "CauseDisDECIDir",
            torch_device,
            **self._deci_model_options.dict(),
        )
        constraint_matrix = DeciRunner._build_azua_constraint_matrix(
            self._prepared_data,  # azua_dataset.variables,
            tabu_child_nodes=self._constraints.causes,
            tabu_parent_nodes=self._constraints.effects,
            tabu_edges=self._constraints.forbiddenRelationships,
        )
        deci_model.set_graph_constraint(constraint_matrix)
        deci_model.run_train(azua_dataset, self._deci_training_options.dict())

        # The next two lines of code are the same as:
        # deci_graph = deci_model.networkx_graph()
        # but omit an assertion that the graph is a DAG.  This is so the calculation doesn't just
        # fail after 20 minutes due to a single bad edge.
        # adj_mat = deci_model.get_adj_matrix(samples=1, most_likely_graph=True, squeeze=True)
        adj_mat = deci_model.get_adj_matrix_tensor(
            do_round=False, samples=1, most_likely_graph=True
        )
        adj_mat = adj_mat.squeeze(0)
        adj_mat = adj_mat.detach().cpu().numpy().astype(np.float64)
        ate_mat = DeciRunner._compute_deci_average_treatment_effect(
            deci_model, azua_dataset
        )

        deci_model.eval()
        numCols = self._prepared_data.shape[1]
        intervention_mask = torch.cat(
            (
                torch.zeros(math.ceil(numCols / 2), dtype=torch.bool),
                torch.ones(math.floor(numCols / 2), dtype=torch.bool),
            ),
            0,
        )
        intervention_values = torch.rand(math.floor(numCols / 2))
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
            torch.rand([1, numCols]),
            torch.from_numpy(adj_mat).float(),
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
            # verbose=True,
            # keep_initializers_as_inputs=True,
            dynamic_axes={
                # 'intervention_mask' : {0 : 'intervention_count'},    # variable length axes
                "intervention_values": {0: "intervention_count"}
            },
        )
        onnx_base64 = base64.b64encode(onnx_output.getvalue())

        deci_graph = networkx.convert_matrix.from_numpy_matrix(
            adj_mat, create_using=networkx.DiGraph
        )
        deci_ate_graph = networkx.convert_matrix.from_numpy_matrix(
            ate_mat, create_using=networkx.DiGraph
        )

        for n1, n2, d in deci_graph.edges(data=True):
            # TODO: validate what to do when there is no edge in the ate graph
            #       currently returning weight 0
            ate = deci_ate_graph.get_edge_data(n1, n2, default={"weight": 0})["weight"]
            d["confidence"] = d.pop("weight", None)
            d["weight"] = ate

        labels = {
            i: self._prepared_data.columns[i]
            for i in range(len(self._prepared_data.columns))
        }
        labeled_graph = networkx.relabel_nodes(deci_graph, labels)
        graph_json = json_graph.cytoscape_data(labeled_graph)
        graph_json["onnx"] = onnx_base64
        graph_json["columns"] = [
            self._prepared_data.columns[i]
            for i in range(len(self._prepared_data.columns))
        ]
        graph_json["confidence_matrix"] = adj_mat.tolist()
        graph_json["ate_matrix"] = ate_mat.tolist()
        graph_json["interpret_boolean_as_continuous"] = interpret_boolean_as_continuous
        graph_json["has_weights"] = True
        graph_json["has_confidence_values"] = True

        return graph_json

    @staticmethod
    def _build_azua_constraint_matrix(
        variables, tabu_child_nodes=None, tabu_parent_nodes=None, tabu_edges=None
    ):
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

        constraint = np.full((len(variables.columns), len(variables.columns)), np.nan)
        name_to_idx = {name: i for (i, name) in enumerate(variables.columns)}
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

    @staticmethod
    def _compute_deci_average_treatment_effect(model, dataset):
        train_data = pd.DataFrame(dataset.train_data_and_mask[0])
        treatment_values = train_data.mean(0) + train_data.std(0)
        reference_values = train_data.mean(0) - train_data.std(0)
        ates = []

        for variable in range(treatment_values.shape[0]):
            intervention_idxs = torch.tensor([variable])
            intervention_value = torch.tensor([treatment_values[variable]])
            reference_value = torch.tensor([reference_values[variable]])
            print(
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
