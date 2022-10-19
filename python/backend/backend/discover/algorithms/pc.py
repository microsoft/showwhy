import logging

import networkx
from castle.algorithms import PC
from networkx.readwrite import json_graph

from backend.discover.algorithms.commons.base_runner import (
    CausalDiscoveryRunner,
    CausalGraph,
)
from backend.discover.model.causal_discovery import CausalDiscoveryPayload


class PCPayload(CausalDiscoveryPayload):
    pass


class PCRunner(CausalDiscoveryRunner):
    def __init__(self, p: PCPayload):
        super().__init__(p)

    def do_causal_discovery(self) -> CausalGraph:
        n = PC(alpha=0.2)
        n.learn(self._prepared_data.to_numpy())
        graph_gc = networkx.DiGraph(n.causal_matrix)
        self._remove_weights(graph_gc)

        logging.info(graph_gc)
        labels = {
            i: self._prepared_data.columns[i]
            for i in range(len(self._prepared_data.columns))
        }
        labeled_gc = networkx.relabel_nodes(graph_gc, labels)
        graph_json = json_graph.cytoscape_data(labeled_gc)
        graph_json["has_weights"] = False
        graph_json["has_confidence_values"] = False

        return graph_json

    def _remove_weights(self, graph):
        for _n1, _n2, d in graph.edges(data=True):
            del d["weight"]
