#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import networkx as nx
import pandas as pd
from dowhy import CausalModel

from backend.exposure.model.identify_estimand_models import IdentifyEstimandResult


def identify_estimand(causal_graph, dataframe, treatment, outcome, controls):
    causal_graph_nx = nx.cytoscape_graph({"data": [], "directed": True, "multigraph": False, **causal_graph})
    gml_graph = " ".join(nx.generate_gml(causal_graph_nx))

    if dataframe is not None:
        causal_model = CausalModel(
            data=dataframe,
            treatment=treatment,
            outcome=outcome,
            graph=gml_graph,
        )
    else:
        columns = controls + [treatment, outcome]
        model_data = pd.DataFrame(columns=columns)
        causal_model = CausalModel(
            data=model_data,
            treatment=treatment,
            outcome=outcome,
            graph=gml_graph,
        )

    primary_estimand = causal_model.identify_effect(proceed_when_unidentifiable=True, optimize_backdoor=True)

    return IdentifyEstimandResult(
        estimate_possibility=primary_estimand.estimands["backdoor"] is not None,
        backdoor_variables=primary_estimand.get_backdoor_variables(),
        frontdoor_variables=primary_estimand.get_frontdoor_variables(),
        instrumental_variables=primary_estimand.get_instrumental_variables(),
        causal_model=causal_model,
    )
