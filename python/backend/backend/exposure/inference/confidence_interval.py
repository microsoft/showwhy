#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
from typing import Dict, Tuple

from dowhy.causal_estimator import CausalEstimate

from backend.exposure.config import get_confidence_simulations
from backend.exposure.model.confidence_interval_models import ConfidenceIntervalParams, ConfidenceIntervalResult
from backend.exposure.model.estimate_effect_models import EstimateResult


def get_tasks(estimate_effect_results, estimate_execution_ids):
    filtered_results = [result for result in estimate_effect_results if result.id in estimate_execution_ids]
    return [ConfidenceIntervalParams(estimate=estimate_result) for estimate_result in filtered_results]


def estimate_confidence_intervals(
    estimated_effect: EstimateResult,
    confidence_level: float = 0.95,
    sample_size_fraction: float = 1.0,
) -> Dict:
    try:
        if "econml" in str(estimated_effect.estimate.params["estimator_class"]):
            confidence_intervals = estimate_econml_confidence_intervals(estimated_effect.estimate)
        else:
            confidence_intervals = estimated_effect.estimate.get_confidence_intervals(
                confidence_level=confidence_level,
                method="bootstrap",
                num_simulations=get_confidence_simulations(),
                sample_size_fraction=sample_size_fraction,
            )
        return ConfidenceIntervalResult(
            lower_bound=confidence_intervals[0],
            upper_bound=confidence_intervals[1],
            estimate_id=estimated_effect.id,
        )
    except Exception as e:
        logging.info(f"Cannot compute confidence interval: {e}." "Returning None values for confidence intervals")
        return ConfidenceIntervalResult(
            lower_bound=None,
            upper_bound=None,
            estimate_id=estimated_effect.id,
        )


def estimate_econml_confidence_intervals(
    estimate: CausalEstimate,
) -> Tuple[float, float]:
    effect_modifiers = estimate.estimator._effect_modifiers
    return estimate.estimator.estimator.effect_inference(X=effect_modifiers).population_summary().conf_int_mean()
