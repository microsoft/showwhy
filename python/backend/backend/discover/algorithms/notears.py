from causalnex.structure.notears import from_pandas
from networkx.readwrite import json_graph

from backend.discover.algorithms.commons.base_runner import (
    CausalDiscoveryRunner,
    CausalGraph,
    ProgressCallback,
)
from backend.discover.model.causal_discovery import CausalDiscoveryPayload


class NotearsPayload(CausalDiscoveryPayload):
    pass


class NotearsRunner(CausalDiscoveryRunner):
    name = "Notears"

    def __init__(self, p: NotearsPayload, progress_callback: ProgressCallback = None):
        super().__init__(p, progress_callback)

    def do_causal_discovery(self) -> CausalGraph:
        notears_graph = from_pandas(
            self._prepared_data,
            tabu_child_nodes=self._constraints.causes,
            tabu_parent_nodes=self._constraints.effects,
            tabu_edges=self._constraints.forbiddenRelationships,
        )

        graph_json = json_graph.cytoscape_data(notears_graph)

        graph_json["has_weights"] = True
        graph_json["has_confidence_values"] = False

        self._report_progress(100.0)

        return graph_json
