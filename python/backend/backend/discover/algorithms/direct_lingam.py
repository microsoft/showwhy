import logging

import causalnex
import networkx
import numpy as np
from castle.algorithms import DirectLiNGAM
from networkx.readwrite import json_graph

from backend.discover.algorithms.commons.base_runner import (
    CausalDiscoveryRunner,
    CausalGraph,
    ProgressCallback,
)
from backend.discover.model.causal_discovery import CausalDiscoveryPayload


class DirectLiNGAMPayload(CausalDiscoveryPayload):
    pass


class DirectLiNGAMRunner(CausalDiscoveryRunner):
    name = "DirectLiNGAM"

    def __init__(
        self, p: DirectLiNGAMPayload, progress_callback: ProgressCallback = None
    ):
        super().__init__(p, progress_callback)

    def do_causal_discovery(self) -> CausalGraph:
        prior_matrix = self._build_gcastle_constraint_matrix()

        n = DirectLiNGAM(prior_knowledge=prior_matrix)  # , thresh=0.1)
        n.learn(self._prepared_data.to_numpy())
        graph_gc = causalnex.structure.StructureModel(n.causal_matrix)

        logging.info(graph_gc)

        labels = {
            i: self._prepared_data.columns[i]
            for i in range(len(self._prepared_data.columns))
        }
        labeled_gc = networkx.relabel_nodes(graph_gc, labels)

        graph_json = json_graph.cytoscape_data(labeled_gc)

        graph_json["has_weights"] = True
        graph_json["has_confidence_values"] = False
        graph_json["normalized_columns_metadata"] = self._normalized_columns_metadata

        self._report_progress(100.0)

        return graph_json

    def _build_gcastle_constraint_matrix(self):
        columns = self._prepared_data.columns
        col_to_index = {columns[i]: i for i in range(len(columns))}
        prior_matrix = np.full((len(columns), len(columns)), -1)

        for cause in self._constraints.causes:
            prior_matrix[col_to_index[cause], :] = 0
        for effect in self._constraints.effects:
            prior_matrix[:, col_to_index[effect]] = 0
        for forbidden_relationship in self._constraints.forbiddenRelationships:
            prior_matrix[
                col_to_index[forbidden_relationship[0]],
                col_to_index[forbidden_relationship[1]],
            ] = 0

        logging.info(columns)
        logging.info(prior_matrix)

        return prior_matrix
