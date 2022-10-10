#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import itertools
from typing import List

import networkx as nx

from backend.exposure.model.estimate_effect_models import (
    CausalGraphModelSpec,
    ModelSpec,
    OutcomeSpec,
    TreatmentSpec,
)


def __create_gml_graph(
    treatment_specs: List[TreatmentSpec],
    outcome_specs: List[OutcomeSpec],
    model_spec: ModelSpec,
) -> List[CausalGraphModelSpec]:
    """
    Given input for a model type (e.g. maximum model),
    create associated causal graphs in the gml format
    """

    graphs = []
    for treatment, outcome in list(itertools.product(treatment_specs, outcome_specs)):
        treatment = treatment.variable
        outcome = outcome.variable
        causal_graph = nx.DiGraph()

        nodes = (
            [treatment]
            + [outcome]
            + model_spec.confounders
            + model_spec.effect_modifiers
        )
        # add nodes
        for variable in nodes:
            causal_graph.add_node(variable)

        # add confounder edges
        for confounder in model_spec.confounders:
            causal_graph.add_edge(confounder, treatment)
            causal_graph.add_edge(confounder, outcome)

        for modifier in model_spec.effect_modifiers:
            causal_graph.add_edge(modifier, outcome)

        # add treatments to outcome edges
        causal_graph.add_edge(treatment, outcome)

        graphs.append(
            CausalGraphModelSpec(
                type=model_spec.type,
                label=model_spec.label,
                treatment=treatment,
                outcome=outcome,
                confounders=model_spec.confounders,
                effect_modifiers=model_spec.effect_modifiers,
                causal_graph=" ".join(nx.generate_gml(causal_graph)),
            )
        )
    return graphs


def create_gml_model_specs(
    treatment_specs: List[TreatmentSpec],
    outcome_specs: List[OutcomeSpec],
    model_specs: List[ModelSpec],
) -> List[CausalGraphModelSpec]:
    """
    Generate gml causal graphs for all model types in the model specs
    (e.g. maximum, intermediate, minimum, and unadjusted models)
    """
    models = []

    for model_spec in model_specs:
        models.extend(__create_gml_graph(treatment_specs, outcome_specs, model_spec))

    return models
