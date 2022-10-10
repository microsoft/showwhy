#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import itertools
from math import sqrt

import numpy as np
from dowhy.causal_estimator import CausalEstimate
from dowhy.causal_identifier import IdentifiedEstimand
from dowhy.causal_model import CausalModel

from backend.exposure.model.refute_estimate_models import RefuterResult, RefuterSpec


def get_tasks(num_simulations_map, estimate_effects_results, refuters):
    return [
        RefuterSpec(
            num_simulations=num_simulations_map[estimate_result.id],
            method_name=method_name,
            estimate=estimate_result,
        )
        for method_name, estimate_result in itertools.product(
            refuters, estimate_effects_results
        )
    ]


def add_unobserved_common_cause(
    model: CausalModel,
    identified_estimand: IdentifiedEstimand,
    estimate: CausalEstimate,
    num_simulations: int = 100,
    **kwargs,
) -> int:
    """
    Simulate a common cause that is correlated with the treatment and outcome.
    The test fails if the new estimate changes sign
        compared to the original estimate
    This test requires domain knowledge to set plausible effect strengths for
        simulating unobserved confounders
    """
    # infer if treatment and outcome are binary variables
    if model._data[model._treatment[0]].nunique() == 2:
        treatment_type = "binary_flip"
    else:
        treatment_type = "linear"
    if model._data[model._outcome[0]].nunique() == 2:
        outcome_type = "binary_flip"
    else:
        outcome_type = "linear"

    num_effect_points = int(round(sqrt(num_simulations), 0))
    if "effect_strength_on_treatment" in kwargs:
        effect_on_treatment = kwargs["effect_strength_on_treatment"]
    else:
        effect_on_treatment = np.linspace(0.0001, 0.01, num_effect_points).tolist()
    if "effect_strength_on_outcome" in kwargs:
        effect_on_outcome = kwargs["effect_strength_on_treatment"]
    else:
        effect_on_outcome = np.linspace(0.0001, 0.01, num_effect_points).tolist()

    refuter = model.refute_estimate(
        identified_estimand,
        estimate,
        method_name="add_unobserved_common_cause",
        confounders_effect_on_treatment=treatment_type,
        confounders_effect_on_outcome=outcome_type,
        effect_strength_on_treatment=effect_on_treatment,
        effect_strength_on_outcome=effect_on_outcome,
    )
    return check_sign_change(refuter.new_effect, estimate.value)


def random_common_cause(
    model: CausalModel,
    identified_estimand: IdentifiedEstimand,
    estimate: CausalEstimate,
    num_simulations: int = 100,
    **kwargs,
) -> int:
    """
    Add white noise variable as a random common cause.
    Use p-value as pass/fail criterion.
    """
    refuter = model.refute_estimate(
        identified_estimand,
        estimate,
        method_name="random_common_cause",
        num_simulations=num_simulations,
    )
    return check_p_value(refuter.refutation_result["p_value"])


def placebo_treatment_refuter(
    model: CausalModel,
    identified_estimand: IdentifiedEstimand,
    estimate: CausalEstimate,
    num_simulations: int = 100,
    **kwargs,
) -> int:
    """
    Replace treatment with a random independent variable.
    Use p-value as pass/fail criterion.
    """
    refuter = model.refute_estimate(
        identified_estimand,
        estimate,
        method_name="placebo_treatment_refuter",
        placebo_type="permute",
        num_simulations=num_simulations,
    )
    return check_p_value(refuter.refutation_result["p_value"])


def data_subset_refuter(
    model: CausalModel,
    identified_estimand: IdentifiedEstimand,
    estimate: CausalEstimate,
    num_simulations: int = 100,
    **kwargs,
) -> int:
    """
    Replace the given subset with a randomly selected subset.
    Use p-value as pass/fail criterion.
    """
    refuter = model.refute_estimate(
        identified_estimand,
        estimate,
        method_name="data_subset_refuter",
        subset_fraction=0.9,
        num_simulations=num_simulations,
    )
    return check_p_value(refuter.refutation_result["p_value"])


def bootstrap_refuter(
    model: CausalModel,
    identified_estimand: IdentifiedEstimand,
    estimate: CausalEstimate,
    num_simulations: int = 100,
    **kwargs,
) -> int:
    """
    Replace the given dataset with a bootstrapped sample of the dataset.
    Use p-value as pass/fail criterion.
    """
    refuter = model.refute_estimate(
        identified_estimand,
        estimate,
        method_name="bootstrap_refuter",
        num_simulations=num_simulations,
    )

    return check_p_value(refuter.refutation_result["p_value"])


def check_sign_change(new_effect, original_estimate) -> int:
    """
    Helper function to co check if the new effects change sign
        (e.g., negative -> positive or vice versal)
    compared to the original effect
    """
    if not isinstance(new_effect, (list, tuple, np.ndarray)):
        return int(new_effect * original_estimate >= 0)
    else:
        return int(
            new_effect[0] * original_estimate >= 0
            and new_effect[1] * original_estimate >= 0
        )


def check_p_value(p_value: float, p_threshold: float = 0.05) -> int:
    """
    Helper function to check if the returned p_value passes the given threshold
    """
    return int(p_value > p_threshold)


REFUTER_FUNC_MAPPING = {
    "add_unobserved_common_cause": add_unobserved_common_cause,
    "random_common_cause": random_common_cause,
    "placebo_treatment_refuter": placebo_treatment_refuter,
    "data_subset_refuter": data_subset_refuter,
    "bootstrap_refuter": bootstrap_refuter,
}


def refute_estimate(spec: RefuterSpec):
    if (
        spec.estimate.causal_model_graph is None
        or spec.estimate.identified_estimand is None
        or spec.estimate.estimate is None
    ):
        return RefuterResult(
            refuter=spec.method_name.replace("_refuter", ""),
            result=None,
            estimate_id=spec.estimate.id,
        )

    model = spec.estimate.causal_model_graph
    identified_estimand = spec.estimate.identified_estimand
    estimate = spec.estimate.estimate

    result = REFUTER_FUNC_MAPPING[spec.method_name](
        model, identified_estimand, estimate, spec.num_simulations
    )

    return RefuterResult(
        refuter=spec.method_name.replace("_refuter", ""),
        result=result,
        estimate_id=spec.estimate.id,
    )
