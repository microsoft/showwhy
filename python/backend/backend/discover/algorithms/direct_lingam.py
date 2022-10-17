import logging

import causalnex
import networkx
import numpy as np
import pandas as pd
from castle.algorithms import DirectLiNGAM
from fastapi import APIRouter
from networkx.readwrite import json_graph

from backend.discover.base_payload import (
    CausalDiscoveryPayload,
    Constraints,
    prepare_data,
)


class DirectLiNGAMPayload(CausalDiscoveryPayload):
    pass


direct_lingam_router = APIRouter()


@direct_lingam_router.post("/")
@prepare_data
def run_direct_lingam(p: DirectLiNGAMPayload):
    logging.info("Running DirectLiNGAM Causal Discovery.")

    prior_matrix = _build_gcastle_constraint_matrix(p._prepared_data, p.constraints)

    n = DirectLiNGAM(prior_knowledge=prior_matrix)  # , thresh=0.1)
    n.learn(p._prepared_data.to_numpy())
    graph_gc = causalnex.structure.StructureModel(n.causal_matrix)

    logging.info(graph_gc)
    labels = {
        i: p._prepared_data.columns[i] for i in range(len(p._prepared_data.columns))
    }
    labeled_gc = networkx.relabel_nodes(graph_gc, labels)
    graph_json = json_graph.cytoscape_data(labeled_gc)
    graph_json["has_weights"] = True
    graph_json["has_confidence_values"] = False

    return graph_json


def _build_gcastle_constraint_matrix(df: pd.DataFrame, constraints: Constraints):
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
