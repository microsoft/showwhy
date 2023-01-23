import logging
from typing import Any

import networkx as nx
import numpy as np
from castle.algorithms import DirectLiNGAM
from causalnex.structure.structuremodel import StructureModel

from backend.discover.algorithms.commons.base_runner import CausalDiscoveryRunner, CausalGraph, ProgressCallback
from backend.discover.model.causal_discovery import CausalDiscoveryPayload


class DirectLiNGAMPayload(CausalDiscoveryPayload):
    pass


class DirectLiNGAMRunner(CausalDiscoveryRunner):
    name = "DirectLiNGAM"

    def __init__(self, p: DirectLiNGAMPayload, progress_callback: ProgressCallback = None):
        super().__init__(p, progress_callback)

    def do_causal_discovery(self) -> CausalGraph:
        self._encode_categorical_as_integers()

        causal_graph = self._build_causal_graph(
            labeled_graph=self._build_labeled_graph(prior_knowledge=self._build_gcastle_constraint_matrix()),
            has_weights=True,
            has_confidence_values=False,
        )

        self._report_progress(100.0)

        return causal_graph

    def _build_labeled_graph(self, prior_knowledge: np.ndarray) -> Any:
        direct_lingam = DirectLiNGAM(
            prior_knowledge=prior_knowledge,
        )

        # we can use thres=0, since the weight filtering will be applied in the frontend
        direct_lingam.learn(self._prepared_data.to_numpy(), thres=0.0)

        return nx.relabel_nodes(
            # transpose the DirectLiNGAM adjacency matrix so we end up with the causal graph
            StructureModel(direct_lingam.adjacency_matrix_.T),
            self._get_labels_map(),
        )

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
