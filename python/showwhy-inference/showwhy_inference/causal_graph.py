#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import itertools

from typing import Dict, List

import networkx as nx


class CausalGraph:
    """
    Generate gml-formatted causal graphs given treatment, outcome,
    confounder and effect modifier specifications.
    This simplifies the json input by enabling front end to pass on a list
    of confounders and effect modifiers as model specs instead of passing
    on actual gml graphs.
    """

    def __init__(
        self,
        treatment_specs: List[Dict],
        outcome_specs: List[Dict],
        model_specs: List[Dict],
    ):
        self.treatment_specs = treatment_specs
        self.outcome_specs = outcome_specs
        self.model_specs = model_specs

    def create_gml_graph(self, model_spec) -> List:
        """
        Given input for a model type (e.g. maximum model),
        create associated causal graphs in the gml format
        """
        confounders = model_spec["confounders"]
        effect_modifiers = model_spec["outcome_determinants"]
        model_type = model_spec["type"]
        model_label = model_spec["label"]

        graphs = []
        for treatment_outcome in list(
            itertools.product(self.treatment_specs, self.outcome_specs)
        ):
            treatment = treatment_outcome[0]["variable"]
            outcome = treatment_outcome[1]["variable"]
            causal_graph = nx.DiGraph()

            # add nodes
            for variable in [treatment] + [outcome] + confounders + effect_modifiers:
                causal_graph.add_node(variable)

            # add confounder edges
            for confounder in confounders:
                causal_graph.add_edge(confounder, treatment)
                causal_graph.add_edge(confounder, outcome)

            for modifier in effect_modifiers:
                causal_graph.add_edge(modifier, outcome)

            # add treatments to outcome edges
            causal_graph.add_edge(treatment, outcome)

            graphs.append(
                {
                    "type": model_type,
                    "label": model_label,
                    "treatment": treatment,
                    "outcome": outcome,
                    "confounders": confounders,
                    "effect_modifiers": effect_modifiers,
                    "causal_graph": " ".join(nx.generate_gml(causal_graph)),
                }
            )
        return graphs

    def create_gml_model_specs(self) -> List:
        """
        Generate gml causal graphs for all model types in the model specs
        (e.g. maximum, intermediate, minimum, and unadjusted models)
        """
        graphs = []
        for spec in self.model_specs:
            graphs = graphs + self.create_gml_graph(spec)
        return graphs
