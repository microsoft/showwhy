from functools import wraps
from typing import Any, Callable, Dict, List, Tuple, Union

import networkx
import pandas as pd
from networkx.readwrite import json_graph
from pydantic import BaseModel, Extra
from sklearn.preprocessing import MaxAbsScaler


class Constraints(BaseModel):
    causes: List[str]
    effects: List[str]
    forbiddenRelationships: List[Tuple[str, str]]


class Dataset(BaseModel):
    data: Dict[str, List[Any]]


class CausalDiscoveryRequest(BaseModel):
    # expected parameters
    dataset: Dataset
    constraints: Constraints

    # internal use only
    _prepared_data: Union[pd.DataFrame, None] = None

    class Config:
        arbitrary_types_allowed = True
        extra = Extra.allow


def prepare_data(func: Callable[[CausalDiscoveryRequest], Any]):
    @wraps(func)
    def wrapper(req: CausalDiscoveryRequest):
        req._prepared_data = pd.DataFrame.from_dict(req.dataset.data)
        req._prepared_data.dropna(inplace=True)

        if req._prepared_data.size == 0:
            return _get_empty_graph_json(req._prepared_data)

        scaled_data = MaxAbsScaler().fit_transform(req._prepared_data)
        # scaled_data = Normalizer().fit_transform(req._prepared_data)
        req._prepared_data = pd.DataFrame(
            data=scaled_data,
            index=req._prepared_data.index,
            columns=req._prepared_data.columns,
        )

        return func(req)

    return wrapper


def _get_empty_graph_json(pandas_data: pd.DataFrame):
    graph = networkx.Graph()
    graph.add_nodes_from(pandas_data.columns)
    return json_graph.cytoscape_data(graph)
