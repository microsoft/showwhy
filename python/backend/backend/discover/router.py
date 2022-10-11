import base64
import io
import logging
import math
import os
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple, Union

import causalnex
import networkx
import numpy as np
import pandas as pd
import torch
from castle.algorithms import PC, DirectLiNGAM
from causalnex.structure.notears import from_pandas
from causica.models.deci.deci_gaussian import DECIGaussian
from causica.models.deci.generation_functions import ContractiveInvertibleGNN
from causica.utils.torch_utils import get_torch_device
from fastapi import APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from networkx.readwrite import json_graph
from pydantic import BaseModel
from sklearn.preprocessing import MaxAbsScaler
from tensorflow.python.framework.ops import disable_eager_execution

from backend.discover.pandas_dataset_loader import PandasDatasetLoader

disable_eager_execution()

torch.set_default_dtype(torch.float32)

discover_router = APIRouter()


class Constraints(BaseModel):
    causes: List[str]
    effects: List[str]
    forbiddenRelationships: List[Tuple[str, str]]


class Dataset(BaseModel):
    data: Dict[str, List[Any]]


class DeciOptions(BaseModel):
    max_steps_auglag: int
    max_auglag_inner_epochs: int


class Algorithms(Enum):
    NOTEARS = "NOTEARS"
    DECI = "DECI"
    DirectLiNGAM = "DirectLiNGAM"
    PC = "PC"


class CausalDiscoveryRequest(BaseModel):
    algorithm: Algorithms
    dataset: Dataset
    constraints: Constraints
    deciOptions: Union[DeciOptions, None] = None

    class Config:
        arbitrary_types_allowed = True


def prepData(req: CausalDiscoveryRequest):
    pandas_data = pd.DataFrame.from_dict(req.dataset.data)
    pandas_data.dropna(inplace=True)
    if pandas_data.size == 0:
        return pandas_data
    scaled_data = MaxAbsScaler().fit_transform(pandas_data)
    # scaled_data = Normalizer().fit_transform(pandas_data)
    pandas_data = pd.DataFrame(
        data=scaled_data, index=pandas_data.index, columns=pandas_data.columns
    )
    return pandas_data


def getEmptyGraphJSON(pandas_data: pd.DataFrame):
    graph = networkx.Graph()
    graph.add_nodes_from(pandas_data.columns)
    return json_graph.cytoscape_data(graph)


@discover_router.get("/")
def main():
    return {"message": "discover api is healthy"}


@discover_router.post("/")
def discover(cd_request: CausalDiscoveryRequest):
    if cd_request.algorithm is None:
        raise HTTPException(status_code=422, detail="No causal algorithm specified")
    elif cd_request.algorithm == Algorithms.NOTEARS:
        return run_notears(cd_request)
    elif cd_request.algorithm == Algorithms.DECI:
        return run_deci_hq(cd_request)
    elif cd_request.algorithm == Algorithms.DirectLiNGAM:
        return run_direct_lingam(cd_request)
    elif cd_request.algorithm == Algorithms.PC:
        return run_pc(cd_request)
    else:
        raise HTTPException(
            status_code=422,
            detail="Unrecognized causal algorithm: $cd_request.algorithm.name",
        )


def run_notears(cd_request: CausalDiscoveryRequest):
    logging.info("Running NOTEARS Causal Discovery.")
    pandas_data = prepData(cd_request)
    if pandas_data.size == 0:
        return getEmptyGraphJSON(pandas_data)

    notears_graph = from_pandas(
        pandas_data,
        tabu_child_nodes=cd_request.constraints.causes,
        tabu_parent_nodes=cd_request.constraints.effects,
        tabu_edges=cd_request.constraints.forbiddenRelationships,
    )
    graph_json = json_graph.cytoscape_data(notears_graph)
    graph_json["has_weights"] = True
    graph_json["has_confidence_values"] = False
    return graph_json


def build_azua_constraint_matrix(
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


def compute_deci_average_treatment_effect(model, dataset):
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


def run_deci_hq(req_body: CausalDiscoveryRequest):
    logging.info("Running DECI Causal Discovery.")
    if req_body.deciOptions is None:
        return run_deci(req_body)
    else:
        return run_deci(
            req_body,
            req_body.deciOptions.max_steps_auglag,
            req_body.deciOptions.max_auglag_inner_epochs,
        )


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


def run_deci(
    req_body: CausalDiscoveryRequest, max_steps_auglag=20, max_auglag_inner_epochs=1000
):
    model_config = {
        "imputation": False,
        "lambda_dag": 100.0,
        "lambda_sparse": 5.0,
        "var_dist_A_mode": "three",
        "mode_adjacency": "learn",
        "norm_layers": False,  # TODO: Once pytorch implements opset 17 we can use nn.LayerNorm
        "res_connection": True,
        "cate_rff_n_features": 3000,
        "cate_rff_lengthscale": 1,
        "encoder_layer_sizes": [32, 32],
        "decoder_layer_sizes": [32, 32],
    }
    # To speed up training you can try:
    #  increasing learning_rate
    #  increasing batch_size (reduces noise when using higher learning rate)
    #  decreasing max_steps_auglag (go as low as you can and still get a DAG)
    #  decreasing max_auglag_inner_epochs
    training_params = {
        "learning_rate": 3e-2,
        "batch_size": 512,
        "stardardize_data_mean": False,
        "stardardize_data_std": False,
        "rho": 10.0,
        "safety_rho": 1e13,
        "alpha": 0.0,
        "safety_alpha": 1e13,
        "tol_dag": 1e-3,
        "progress_rate": 0.25,
        "max_steps_auglag": max_steps_auglag,
        "max_auglag_inner_epochs": max_auglag_inner_epochs,
        "max_p_train_dropout": 0.25,
        "reconstruction_loss_factor": 1.0,
        "anneal_entropy": "noanneal",
    }

    pandas_data = prepData(req_body)
    if pandas_data.size == 0:
        return getEmptyGraphJSON(pandas_data)

    constraints = req_body.constraints

    dataset_loader = PandasDatasetLoader("")
    azua_dataset = dataset_loader.split_data_and_load_dataset(
        pandas_data, 0.5, 0, 0
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
        **model_config,
    )
    constraint_matrix = build_azua_constraint_matrix(
        pandas_data,  # azua_dataset.variables,
        tabu_child_nodes=constraints.causes,
        tabu_parent_nodes=constraints.effects,
        tabu_edges=constraints.forbiddenRelationships,
    )
    deci_model.set_graph_constraint(constraint_matrix)
    deci_model.run_train(azua_dataset, training_params)

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
    ate_mat = compute_deci_average_treatment_effect(deci_model, azua_dataset)

    deci_model.eval()
    numCols = pandas_data.shape[1]
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
        [j for i in deci_model.variables.processed_cols_by_type["binary"] for j in i]
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
        ate = deci_ate_graph.get_edge_data(n1, n2)["weight"]
        d["confidence"] = d.pop("weight", None)
        d["weight"] = ate

    labels = {i: pandas_data.columns[i] for i in range(len(pandas_data.columns))}
    labeled_graph = networkx.relabel_nodes(deci_graph, labels)
    graph_json = json_graph.cytoscape_data(labeled_graph)
    graph_json["onnx"] = onnx_base64
    graph_json["columns"] = [
        pandas_data.columns[i] for i in range(len(pandas_data.columns))
    ]
    graph_json["confidence_matrix"] = adj_mat.tolist()
    graph_json["ate_matrix"] = ate_mat.tolist()
    graph_json["interpret_boolean_as_continuous"] = interpret_boolean_as_continuous
    graph_json["has_weights"] = True
    graph_json["has_confidence_values"] = True
    return graph_json


def build_gcastle_constraint_matrix(df: pd.DataFrame, constraints: Constraints):
    columns = df.columns
    col_to_index = {columns[i]: i for i in range(len(columns))}
    prior_matrix = np.full((len(columns), len(columns)), -1)

    for cause in constraints.causes:
        prior_matrix[col_to_index[cause], :] = 0
    for effect in constraints.effects:
        prior_matrix[:, col_to_index[effect]] = 0
    for forbidden_relationship in constraints.forbiddenRelationships:
        prior_matrix[
            col_to_index[forbidden_relationship[0]],
            col_to_index[forbidden_relationship[1]],
        ] = 0
    logging.info(columns)
    logging.info(prior_matrix)
    return prior_matrix


def run_direct_lingam(req_body: CausalDiscoveryRequest):
    logging.info("Running DirectLiNGAM Causal Discovery.")
    data = prepData(req_body)
    if data.size == 0:
        return getEmptyGraphJSON(data)

    prior_matrix = build_gcastle_constraint_matrix(data, req_body.constraints)

    n = DirectLiNGAM(prior_knowledge=prior_matrix)  # , thresh=0.1)
    n.learn(data.to_numpy())
    graph_gc = causalnex.structure.StructureModel(n.causal_matrix)

    logging.info(graph_gc)
    labels = {i: data.columns[i] for i in range(len(data.columns))}
    labeled_gc = networkx.relabel_nodes(graph_gc, labels)
    graph_json = json_graph.cytoscape_data(labeled_gc)
    graph_json["has_weights"] = True
    graph_json["has_confidence_values"] = False
    return graph_json

def run_pc(req_body: CausalDiscoveryRequest):
    logging.info("Running PC Causal Discovery.")
    data = prepData(req_body)
    if data.size == 0:
        return getEmptyGraphJSON(data)

    #
    # HACK: alpha should be passed in over the wire, and when it's not present,
    # we should infer it from the dataset size.
    #
    n = PC(alpha=0.2)
    n.learn(data.to_numpy())
    graph_gc = networkx.DiGraph(n.causal_matrix)
    remove_weights(graph_gc)

    logging.info(graph_gc)
    labels = {i: data.columns[i] for i in range(len(data.columns))}
    labeled_gc = networkx.relabel_nodes(graph_gc, labels)
    graph_json = json_graph.cytoscape_data(labeled_gc)
    graph_json["has_weights"] = False
    graph_json["has_confidence_values"] = False
    return graph_json


def remove_weights(graph):
    for n1, n2, d in graph.edges(data=True):
        del d["weight"]


def convert_weights_to_confidence(graph):
    for n1, n2, d in graph.edges(data=True):
        d["confidence"] = d.pop("weight", None)


if os.path.isdir("public"):
    discover_router.mount("/", StaticFiles(directory="public", html=True), name="root")
