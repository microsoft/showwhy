import logging
import shutil
from typing import Any, List, Literal, Optional, Tuple, Union

import networkx
import numpy as np
import pandas as pd
import scipy
import torch
from causica.datasets.dataset import Dataset
from causica.datasets.variables import Variable, Variables
from causica.models.deci.deci import DECI
from causica.utils.torch_utils import get_torch_device
from celery import uuid
from pydantic import BaseModel

from backend.discover.algorithms.commons.base_runner import CausalDiscoveryRunner, CausalGraph, ProgressCallback
from backend.discover.algorithms.interventions.deci import DeciInterventionModel
from backend.discover.model.causal_discovery import ATEDetails, CausalDiscoveryPayload, map_to_causica_var_type

torch.set_default_dtype(torch.float32)

TRAINING_PROGRESS_PROPORTION = 0.7

ATE_CALC_PROGRESS_PROPORTION = 0.3

# TODO: UPDATE DEFAULTS
class DeciModelOptions(BaseModel):
    base_distribution_type: Literal["gaussian", "spline"] = "spline"
    spline_bins: int = 8
    imputation: bool = False
    lambda_dag: float = 100.0
    lambda_sparse: float = 5.0
    tau_gumbel: float = 1.0
    var_dist_A_mode: Literal["simple", "enco", "true", "three"] = "three"
    imputer_layer_sizes: Optional[List[int]] = None
    mode_adjacency: Literal["upper", "lower", "learn"] = "learn"
    norm_layers: bool = True
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
# TODO: UPDATE DEFAULTS
class DeciTrainingOptions(BaseModel):
    learning_rate: float = 3e-2
    batch_size: int = 512
    standardize_data_mean: bool = False
    standardize_data_std: bool = False
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


class DeciAteOptions(BaseModel):
    Ngraphs: Optional[int] = 1
    Nsamples_per_graph: Optional[int] = 5000
    most_likely_graph: Optional[int] = True
    ate_details_by_name: dict[str, ATEDetails] = dict()


class DeciPayload(CausalDiscoveryPayload):
    model_options: DeciModelOptions = DeciModelOptions()
    training_options: DeciTrainingOptions = DeciTrainingOptions()
    ate_options: DeciAteOptions = DeciAteOptions()


class DeciRunner(CausalDiscoveryRunner):
    name = "DECI"

    def __init__(self, p: DeciPayload, progress_callback: ProgressCallback = None):
        super().__init__(p, progress_callback)
        self._model_options = p.model_options
        self._training_options = p.training_options
        self._ate_options = p.ate_options
        # make sure every run has its own folder
        self._deci_save_dir = f"CauseDisDECIDir/{uuid()}"
        self._is_dag = None
        self._device = get_torch_device("gpu")

    def _build_causica_dataset(self) -> Dataset:
        self._encode_categorical_as_integers()
        numpy_data = self._prepared_data.to_numpy()
        data_mask = np.ones(numpy_data.shape)

        variables = Variables.create_from_data_and_dict(
            numpy_data,
            data_mask,
            {
                "variables": [
                    {
                        "name": name,
                        # TODO: this is currently mapping categorical to continuous
                        #       we need to update the interventions code to properly handle
                        #       one-hot encoded values
                        "type": map_to_causica_var_type(self._nature_by_variable[name]),
                        "lower": self._prepared_data[name].min(),
                        "upper": self._prepared_data[name].max(),
                    }
                    for name in self._prepared_data.columns
                ]
            },
        )

        return Dataset(train_data=numpy_data, train_mask=data_mask, variables=variables)

    def _build_model(self, causica_dataset: Dataset) -> DECI:
        logging.info(f"Creating DECI model with '{self._model_options.base_distribution_type}' base distribution type")
        deci_model = DECI(
            "CauseDisDECI",
            causica_dataset.variables,
            self._deci_save_dir,
            self._device,
            **self._model_options.dict(),
            graph_constraint_matrix=self._build_constraint_matrix(
                causica_dataset.variables.name_to_idx,
                self._prepared_data,
                tabu_child_nodes=self._constraints.causes,
                tabu_parent_nodes=self._constraints.effects,
                tabu_edges=self._constraints.forbiddenRelationships,
            ),
        )

        return deci_model

    def _build_constraint_matrix(
        self,
        name_to_idx: dict[str, int],
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

    def _check_if_is_dag(self, deci_model: DECI, adj_matrix: np.ndarray) -> bool:
        return (np.trace(scipy.linalg.expm(adj_matrix.round())) - deci_model.num_nodes) == 0

    def _get_adj_matrix(self, deci_model: DECI) -> np.ndarray:
        adj_matrix = deci_model.get_adj_matrix(
            do_round=False,
            samples=1,
            most_likely_graph=True,
            squeeze=True,
        )
        self._is_dag = self._check_if_is_dag(deci_model, adj_matrix)

        return adj_matrix

    def _infer_intervention_reference_values(self, train_data: pd.DataFrame, var: Variable) -> Tuple[float, float]:
        # TODO: perhaps allow the user to set the (intervention, reference) values per variable in the frontend
        if var.type_ == "binary":
            return (1, 0)
        elif var.type_ == "categorical":
            value_counts = train_data[var.name].value_counts()
            return (value_counts.idxmax(), value_counts.idxmin())
        else:
            mean = train_data[var.name].mean()
            std = train_data[var.name].std()
            return (mean + std, mean - std)

    def _get_or_infer_intervention_reference_values(
        self, train_data: pd.DataFrame, var: Variable
    ) -> Tuple[float, float]:
        intervention, reference = self._infer_intervention_reference_values(train_data, var)
        provided_ate_details = self._ate_options.ate_details_by_name.get(var.name, None)

        if provided_ate_details is not None:
            if isinstance(provided_ate_details.intervention, (int, float)):
                intervention = provided_ate_details.intervention
            if isinstance(provided_ate_details.reference, (int, float)):
                reference = provided_ate_details.reference

        return (intervention, reference)

    def _apply_group_mask_to_ate_array(self, ate_array: np.ndarray, group_mask: np.ndarray):
        # categorical columns are one-hot encoded, so we apply the mask to
        # go back to the same dimensionality in the original data
        return [ate_array[mask].mean() for mask in group_mask]

    def _compute_average_treatment_effect(
        self, model: DECI, train_data: pd.DataFrame
    ) -> Tuple[np.ndarray, dict[str, ATEDetails]]:
        ate_matrix = []
        n_variables = train_data.shape[1]
        progress_step = ATE_CALC_PROGRESS_PROPORTION / n_variables

        used_ate_details_by_name = dict()

        if self._ate_options.most_likely_graph and self._ate_options.Ngraphs != 1:
            logging.warning("Adjusting Ngraphs parameter to 1 because most_likely_graph is set to true")
            self._ate_options.Ngraphs = 1

        for variable_index in range(n_variables):
            variable = model.variables[variable_index]
            (
                intervention_value,
                reference_value,
            ) = self._get_or_infer_intervention_reference_values(train_data, variable)

            used_ate_details_by_name[variable.name] = ATEDetails(
                reference=reference_value,
                intervention=intervention_value,
                nature=self._nature_by_variable[variable.name],
            )

            logging.info(
                f"Computing the ATE between {variable.name}={intervention_value} and {variable.name}={reference_value}"
            )

            ate_array, _ = model.cate(
                intervention_idxs=torch.tensor([variable_index]),
                intervention_values=torch.tensor([intervention_value]),
                reference_values=torch.tensor([reference_value]),
                Ngraphs=self._ate_options.Ngraphs,
                Nsamples_per_graph=self._ate_options.Nsamples_per_graph,
                most_likely_graph=self._ate_options.most_likely_graph,
            )
            ate_matrix.append(self._apply_group_mask_to_ate_array(ate_array, model.variables.group_mask))

            self._report_progress((TRAINING_PROGRESS_PROPORTION + ((variable_index + 1) * progress_step)) * 100.0)

        return np.stack(ate_matrix), used_ate_details_by_name

    def _build_labeled_graph(
        self,
        name_to_idx: dict[str, int],
        adj_matrix: np.ndarray,
        ate_matrix: np.ndarray,
    ) -> Any:
        deci_graph = networkx.convert_matrix.from_numpy_matrix(adj_matrix, create_using=networkx.DiGraph)
        deci_ate_graph = networkx.convert_matrix.from_numpy_matrix(ate_matrix, create_using=networkx.DiGraph)
        labels = {idx: name for name, idx in name_to_idx.items()}

        for n1, n2, d in deci_graph.edges(data=True):
            ate = deci_ate_graph.get_edge_data(n1, n2, default={"weight": 0})["weight"]
            d["confidence"] = d.pop("weight", None)
            d["weight"] = ate

        return networkx.relabel_nodes(deci_graph, labels)

    def _do_causal_discovery(self) -> CausalGraph:
        # if the data contains only a single column,
        # let's return an empty graph
        if self._prepared_data.columns.size == 1:
            return self._get_empty_graph_json(self._prepared_data)

        causica_dataset = self._build_causica_dataset()

        train_data = pd.DataFrame(causica_dataset._train_data, columns=self._prepared_data.columns)

        deci_model = self._build_model(causica_dataset)

        training_options_dict = self._training_options.dict()

        logging.info(f"running training with options: {training_options_dict}")

        deci_model.run_train(
            causica_dataset,
            training_options_dict,
            lambda model_id, step, max_steps: self._report_progress(
                (step * 100.0 / max_steps) * TRAINING_PROGRESS_PROPORTION
            ),
        )

        adj_matrix = self._get_adj_matrix(deci_model)

        ate_matrix, used_ate_details_by_name = self._compute_average_treatment_effect(deci_model, train_data)

        deci_model.eval()

        intervention_model = DeciInterventionModel(deci_model, adj_matrix, ate_matrix, train_data)

        causal_graph = self._build_causal_graph(
            labeled_graph=self._build_labeled_graph(deci_model.variables.name_to_idx, adj_matrix, ate_matrix),
            has_weights=True,
            has_confidence_values=True,
            columns=self._get_column_names(),
            is_dag=bool(self._is_dag),
            intervention_model_id=intervention_model.id,
            ate_details_by_name=used_ate_details_by_name,
        )

        intervention_model.save()

        self._report_progress(100.0)

        return causal_graph

    def do_causal_discovery(self) -> CausalGraph:
        try:
            return self._do_causal_discovery()
        finally:
            # cleanup deci save dir
            shutil.rmtree(self._deci_save_dir, ignore_errors=True)
