import logging

import networkx
from castle.algorithms import PC
from fastapi import APIRouter
from networkx.readwrite import json_graph

from backend.discover.base_payload import CausalDiscoveryPayload, prepare_data


class PCPayload(CausalDiscoveryPayload):
    pass


pc_router = APIRouter()


@pc_router.post("/")
@prepare_data
def run_pc(p: PCPayload):
    logging.info("Running PC Causal Discovery.")

    #
    # HACK: alpha should be passed in over the wire, and when it's not present,
    # we should infer it from the dataset size.
    #
    n = PC(alpha=0.2)
    n.learn(p._prepared_data.to_numpy())
    graph_gc = networkx.DiGraph(n.causal_matrix)
    _remove_weights(graph_gc)

    logging.info(graph_gc)
    labels = {
        i: p._prepared_data.columns[i] for i in range(len(p._prepared_data.columns))
    }
    labeled_gc = networkx.relabel_nodes(graph_gc, labels)
    graph_json = json_graph.cytoscape_data(labeled_gc)
    graph_json["has_weights"] = False
    graph_json["has_confidence_values"] = False

    return graph_json


def _remove_weights(graph):
    for n1, n2, d in graph.edges(data=True):
        del d["weight"]
