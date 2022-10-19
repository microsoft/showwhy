from functools import wraps
from typing import Any, Callable

import networkx
import pandas as pd
from networkx.readwrite import json_graph
from sklearn.preprocessing import MaxAbsScaler

from backend.discover.model.causal_discovery import CausalDiscoveryPayload


def prepare_data(func: Callable[[CausalDiscoveryPayload], Any]):
    @wraps(func)
    def wrapper(p: CausalDiscoveryPayload):
        p._prepared_data = pd.DataFrame.from_dict(p.dataset.data)
        p._prepared_data.dropna(inplace=True)

        if p._prepared_data.size == 0:
            return get_empty_graph_json(p._prepared_data)

        # TODO: do mean / std normalization instead
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
