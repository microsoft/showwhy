import logging

from causalnex.structure.notears import from_pandas

from backend.discover.algorithms.commons.base_runner import CausalDiscoveryRunner, CausalGraph, ProgressCallback
from backend.discover.model.causal_discovery import CausalDiscoveryPayload


class NotearsPayload(CausalDiscoveryPayload):
    max_iter: int = 100


class NotearsRunner(CausalDiscoveryRunner):
    name = "Notears"

    def __init__(self, p: NotearsPayload, progress_callback: ProgressCallback = None):
        super().__init__(p, progress_callback)
        self._max_iter = p.max_iter

    def do_causal_discovery(self) -> CausalGraph:
        self._encode_categorical_as_integers()

        logging.info(f"Running NOTEARS with max_iter={self._max_iter}, h_tol=1e-8 and w_threshold=0.0")

        causal_graph = self._build_causal_graph(
            labeled_graph=from_pandas(
                X=self._prepared_data,
                max_iter=self._max_iter,
                h_tol=1e-8,
                # we can use w_threshold=0, since the weight
                # filtering will be applied in the frontend
                w_threshold=0.0,
                tabu_child_nodes=self._constraints.causes,
                tabu_parent_nodes=self._constraints.effects,
                tabu_edges=self._constraints.forbiddenRelationships,
            ),
            has_weights=True,
            has_confidence_values=False,
        )

        self._report_progress(100.0)

        return causal_graph
