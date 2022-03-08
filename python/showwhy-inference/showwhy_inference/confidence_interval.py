#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import Dict, Tuple

from dowhy.causal_estimator import CausalEstimate

from showwhy_inference.inference_config import DEFAULT_CI_SIMULATIONS


class ConfidenceInterval:
    """
    Calculate confidence intervals using either default econML method
    or bootstrap resampling
    """

    def __init__(
        self,
        confidence_level: float = 0.95,
        num_simulations: int = DEFAULT_CI_SIMULATIONS,
        sample_size_fraction: float = 1.0,
    ):
        self.confidence_level = confidence_level
        self.num_simulations = num_simulations
        self.sample_size_fraction = sample_size_fraction

    def estimate_confidence_intervals(self, estimate: CausalEstimate) -> Dict:
        try:
            if "econml" in str(estimate.params["estimator_class"]):
                confidence_intervals = self.estimate_econml_confidence_intervals(
                    estimate
                )
            else:
                confidence_intervals = estimate.get_confidence_intervals(
                    confidence_level=self.confidence_level,
                    method="bootstrap",
                    num_simulations=self.num_simulations,
                    sample_size_fraction=self.sample_size_fraction,
                )
            return {
                "lower_bound": confidence_intervals[0],
                "upper_bound": confidence_intervals[1],
            }
        except Exception as e:
            logging.info(
                f"Cannot compute confidence interval: {e}."
                "Returning None values for confidence intervals"
            )
            return {"lower_bound": None, "upper_bound": None}

    def estimate_econml_confidence_intervals(
        self, estimate: CausalEstimate
    ) -> Tuple[float, float]:
        effect_modifiers = estimate.estimator._effect_modifiers
        return (
            estimate.estimator.estimator.effect_inference(X=effect_modifiers)
            .population_summary()
            .conf_int_mean()
        )
