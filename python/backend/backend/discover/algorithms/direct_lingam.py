import logging
from typing import Any

import networkx as nx
import numpy as np
from causalnex.structure.structuremodel import StructureModel
from lingam import DirectLiNGAM

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
            labeled_graph=self._build_labeled_graph(
                # direct lingam works with the indexes flipped
                # so we transpose the constraint matrix
                prior_knowledge=self._build_constraint_matrix(
                    name_to_idx=self._get_name_to_index(),
                    tabu_child_nodes=self._constraints.causes,
                    tabu_parent_nodes=self._constraints.effects,
                    tabu_edges=self._constraints.forbiddenRelationships,
                ).T
            ),
            has_weights=True,
            has_confidence_values=False,
        )

        self._report_progress(100.0)

        return causal_graph

    def _build_labeled_graph(self, prior_knowledge: np.ndarray) -> Any:
        logging.info("Running DirectLiNGAM with measure=pwling and thres=0.0")

        # measure parameter is not exposed to the frontend, using measure=pwling
        direct_lingam = DirectLiNGAM(prior_knowledge=prior_knowledge, measure="pwling")

        direct_lingam.fit(self._prepared_data.to_numpy())

        return nx.relabel_nodes(
            # transpose the DirectLiNGAM adjacency matrix so we end up with the causal graph
            StructureModel(direct_lingam.adjacency_matrix_.T),
            self._get_labels_map(),
        )
