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


class CausalDiscoveryPayload(BaseModel):
    # expected parameters
    dataset: Dataset
    constraints: Constraints

    # internal use only
    _prepared_data: Union[pd.DataFrame, None] = None

    class Config:
        arbitrary_types_allowed = True
        extra = Extra.allow


def prepare_data(func: Callable[[CausalDiscoveryPayload], Any]):
    @wraps(func)
    def wrapper(p: CausalDiscoveryPayload):
        p._prepared_data = pd.DataFrame.from_dict(p.dataset.data)
        p._prepared_data.dropna(inplace=True)

        if p._prepared_data.size == 0:
            return get_empty_graph_json(p._prepared_data)

        scaled_data = MaxAbsScaler().fit_transform(p._prepared_data)
        p._prepared_data = pd.DataFrame(
            data=scaled_data,
            index=p._prepared_data.index,
            columns=p._prepared_data.columns,
        )

        return func(p)

    return wrapper


def get_empty_graph_json(pandas_data: pd.DataFrame):
    graph = networkx.Graph()
    graph.add_nodes_from(pandas_data.columns)
    return json_graph.cytoscape_data(graph)
