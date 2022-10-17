import logging

from causalnex.structure.notears import from_pandas
from fastapi import APIRouter
from networkx.readwrite import json_graph

from backend.discover.request_models import CausalDiscoveryRequest, prepare_data


class CDNotearsRequest(CausalDiscoveryRequest):
    pass


notears_router = APIRouter()


@notears_router.post("/")
@prepare_data
def run_notears(req: CDNotearsRequest):
    logging.info("Running NOTEARS Causal Discovery.")

    notears_graph = from_pandas(
        req._prepared_data,
        tabu_child_nodes=req.constraints.causes,
        tabu_parent_nodes=req.constraints.effects,
        tabu_edges=req.constraints.forbiddenRelationships,
    )

    graph_json = json_graph.cytoscape_data(notears_graph)
    graph_json["has_weights"] = True
    graph_json["has_confidence_values"] = False

    return graph_json
