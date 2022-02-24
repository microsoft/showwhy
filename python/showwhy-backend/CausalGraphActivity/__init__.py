#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

import networkx as nx
import pandas as pd
from dowhy import CausalModel
from shared_code.io.storage import get_storage_client


storage = get_storage_client()


def main(body: Dict) -> str:

    session_id = body['session_id']
    node_data = body['node_data']
    context = storage.read_context(session_id)

    causal_graph_nx = nx.cytoscape_graph({
        "data": [],
        "directed": True,
        "multigraph": False,
        **node_data['causal_graph']
    })
    gml_graph = " ".join(nx.generate_gml(causal_graph_nx))

    if node_data['dataframe'] != "None":
        context[node_data['result']] = CausalModel(data=context[node_data['dataframe']],
                                                   treatment=node_data['treatment'],
                                                   outcome=node_data['outcome'],
                                                   graph=gml_graph)
    else:
        columns = node_data['controls'] + \
            [node_data['treatment'], node_data['outcome']]
        model_data = pd.DataFrame(columns=columns)
        context[node_data['result']] = CausalModel(data=model_data,
                                                   treatment=node_data['treatment'],
                                                   outcome=node_data['outcome'],
                                                   graph=gml_graph)
    output = storage.write_output(session_id, node_data['result'],
                                  context[node_data['result']], file_type='final')

    storage.write_context(context)

    return {
        'output_file': output,
        'gml_graph': gml_graph
    }
