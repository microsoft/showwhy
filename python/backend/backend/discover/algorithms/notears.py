import logging

from causalnex.structure.notears import from_pandas
from fastapi import APIRouter
from networkx.readwrite import json_graph

from backend.discover.base_payload import CausalDiscoveryPayload, prepare_data


class NotearsPayload(CausalDiscoveryPayload):
    pass


notears_router = APIRouter()


@notears_router.post("/")
@prepare_data
def run_notears(p: NotearsPayload):
    logging.info("Running NOTEARS Causal Discovery.")

    notears_graph = from_pandas(
        p._prepared_data,
        tabu_child_nodes=p.constraints.causes,
        tabu_parent_nodes=p.constraints.effects,
        tabu_edges=p.constraints.forbiddenRelationships,
    )

    graph_json = json_graph.cytoscape_data(notears_graph)
    graph_json["has_weights"] = True
    graph_json["has_confidence_values"] = False

    return graph_json
