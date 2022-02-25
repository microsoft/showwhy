#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from math import sqrt
from typing import Dict

import numpy as np

from dowhy.causal_estimator import CausalEstimate
from dowhy.causal_identifier import IdentifiedEstimand
from dowhy.causal_model import CausalModel
from showwhy_inference.inference_config import (
    DEFAULT_REFUTATION_SIMULATIONS,
    DEFAULT_REFUTATION_TESTS,
    INCLUDE_SENSITIVITY_REFUTERS,
    SENSITIVITY_REFUTERS,
)


class Refutation:
    def __init__(self, refuter_spec: Dict):
        self.refuter_spec = refuter_spec

        # placeholder dict so we will still have these columns in the
        # final results in case the refuter can't be run
        self.default_results = {}
        refutation_tests = (
            DEFAULT_REFUTATION_TESTS
            if not INCLUDE_SENSITIVITY_REFUTERS
            else DEFAULT_REFUTATION_TESTS + SENSITIVITY_REFUTERS
        )
        for test in refutation_tests:
            self.default_results[f'refuter_{test.replace("_refuter", "")}'] = None

    def refute_estimate(
        self,
        model: CausalModel,
        identified_estimand: IdentifiedEstimand,
        estimate: CausalEstimate,
    ) -> Dict:
        """
        Run estimate through a given refutation test defined in the refuter_spec dict
        """
        if not self.refuter_spec:
            return self.default_results

        results = {}
        refuter = self.refuter_spec

        if (model is None) or (identified_estimand is None) or (estimate is None):
            results[f'refuter_{refuter["method_name"].replace("_refuter", "")}'] = None
            return results
        else:
            params = [model, identified_estimand, estimate, refuter["num_simulations"]]
            try:
                results[
                    f'refuter_{refuter["method_name"].replace("_refuter", "")}'
                ] = getattr(self, refuter["method_name"])(*params)
            except Exception:
                results[
                    f'refuter_{refuter["method_name"].replace("_refuter", "")}'
                ] = None
            finally:
                return results

    def add_unobserved_common_cause(
        self,
        model: CausalModel,
        identified_estimand: IdentifiedEstimand,
        estimate: CausalEstimate,
        num_simulations: int = DEFAULT_REFUTATION_SIMULATIONS,
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
        return self.check_sign_change(refuter.new_effect, estimate.value)

    def random_common_cause(
        self,
        model: CausalModel,
        identified_estimand: IdentifiedEstimand,
        estimate: CausalEstimate,
        num_simulations: int = DEFAULT_REFUTATION_SIMULATIONS,
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
        return self.check_p_value(refuter.refutation_result["p_value"])

    def placebo_treatment_refuter(
        self,
        model: CausalModel,
        identified_estimand: IdentifiedEstimand,
        estimate: CausalEstimate,
        num_simulations: int = DEFAULT_REFUTATION_SIMULATIONS,
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
        return self.check_p_value(refuter.refutation_result["p_value"])

    def data_subset_refuter(
        self,
        model: CausalModel,
        identified_estimand: IdentifiedEstimand,
        estimate: CausalEstimate,
        num_simulations: int = DEFAULT_REFUTATION_SIMULATIONS,
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
        return self.check_p_value(refuter.refutation_result["p_value"])

    def bootstrap_refuter(
        self,
        model: CausalModel,
        identified_estimand: IdentifiedEstimand,
        estimate: CausalEstimate,
        num_simulations: int = DEFAULT_REFUTATION_SIMULATIONS,
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

        return self.check_p_value(refuter.refutation_result["p_value"])

    def check_sign_change(self, new_effect, original_estimate) -> int:
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

    def check_p_value(self, p_value: float, p_threshold: float = 0.05) -> int:
        """
        Helper function to check if the returned p_value passes the given threshold
        """
        return int(p_value > p_threshold)
