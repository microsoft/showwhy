#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import copy
import logging

import numpy as np
from shared_code.inference.estimator import CausalEstimator

"""
Perform a statistical significance test on the final specification set.
Hypothesis: The median effect size in the observed curve is statistically different than in the null distribution.
Conditional permutation test:
    For each simulation:
    1. Compute propensity score based on confounders
    2. Stratify dataset based on propensity score (records within the same strata are likely to have similar confounders)
    3. Shuffle treatment values within each stratum
    4. Rerun specs using the bootstrapped sample, compute median effect of the null curve
    5. Repeat steps 1-4 for X simualations to generate a bootstrapped null curve distribution
    6. Compute p-value by comparing the observed median effect with the null curve metrics
"""


def __calculate_propensity_score(identified_estimand, causal_model, estimate):
    # calculate propensity score if needed
    if "propensity_score" not in causal_model._data.columns or 'PropensityScoreWeighting' in (str(estimate.params["estimator_class"])):
        observed_common_causes = copy.deepcopy(
            identified_estimand.get_backdoor_variables())
        if len(observed_common_causes) > 0:
            treatment_var = identified_estimand.treatment_variable
            propensity_model = CausalEstimator().tune_classifier_model(
                identified_estimand, causal_model)
            propensity_model.fit(
                causal_model._data[observed_common_causes], causal_model._data[treatment_var])
            causal_model._data['propensity_score'] = propensity_model.predict_proba(
                causal_model._data[observed_common_causes])[:, 1]
        else:
            logging.info(
                "Observed common causes are required to train propensity model")
    else:
        logging.info("Propensity score has already been calculated")


def calculate_all_propensity_scores(inference_results, num_strata=5):
    """
    Compute propensity scores for all specs and stratify data based on propensity scores
    """
    for result in inference_results:
        causal_model, identified_estimand, estimate = result["estimated_effect"]
        __calculate_propensity_score(
            identified_estimand, causal_model, estimate)
        if "propensity_score" in causal_model._data.columns:
            num_rows = causal_model._data.shape[0]
            causal_model._data['sig_strata'] = ((causal_model._data["propensity_score"].rank(
                ascending=True) / num_rows) * num_strata).round(0)
    return inference_results


def __generate_bootstrap_sample(identified_estimand, causal_model):
    """
    Generate bootstrapped sample by randomly shuffling treatment values within each stratum
    """
    treatment_var = identified_estimand.treatment_variable
    if "sig_strata" in causal_model._data.columns:
        causal_model._data[treatment_var] = causal_model._data.groupby(
            'sig_strata')[treatment_var].transform(np.random.permutation)
    else:
        causal_model._data[treatment_var] = causal_model._data[treatment_var].transform(
            np.random.permutation)


def compute_null_effect(inference_results):
    """
    Compute new effects with bootstrapped sample
    """
    try:
        new_effects = []
        for result in inference_results:
            causal_model, identified_estimand, estimate = result["estimated_effect"]
            __generate_bootstrap_sample(identified_estimand, causal_model)

            # estimate new effect with bootstrapped sample
            estimator_name = __get_estimator_name(estimate)
            print(estimator_name)
            estimate = causal_model.estimate_effect(identified_estimand,
                                                    method_name=estimator_name,
                                                    method_params=estimate.params["method_params"])
            new_effects.append(estimate.value)
        logging.info(
            f"New effects under the null: {np.nanmedian(new_effects)}")
        return np.nanmedian(new_effects)
    except:
        return None


def perform_significance_test(inference_results, null_effects):
    """
    p-value: % of times that an equally or more extreme value was observed in the bootstrapped null curve distribution
    """
    original_effect = __calculate_original_effect(inference_results)
    extreme_results = [effect for effect in null_effects if (
        effect >= original_effect and original_effect >= 0) or (effect <= original_effect and original_effect < 0)]
    p_value = len(extreme_results)/len(null_effects)
    logging.info(f"p-value: {p_value}")
    if p_value < 0.001:
        p_value_str = "p<0.001"
    elif p_value < 0.01:
        p_value_str = "p<0.01"
    elif p_value <= 0.05:
        p_value_str = "p<=0.05"
    else:
        p_value_str = "p>0.05"

    return {
        "p_value": p_value_str,
        "significance": 1 if p_value <= 0.05 else 0
    }


def __calculate_original_effect(inference_results):
    """
    Helper function to calculate median effect of original estimates
    """
    original_effects = []
    for result in inference_results:
        effect = result["estimated_effect"][2].value if result["estimated_effect"][2] else None
        original_effects.append(effect)
    return np.nanmedian(original_effects)


def __get_estimator_name(estimate):
    """
    Helper function to get estimator name for a given estimate
    """
    if "econml" in (str(estimate.params["estimator_class"])):
        estimator_name = "backdoor.econml." + \
            estimate.params["method_params"]["_econml_methodname"].replace(
                "econml.", "")
    else:
        estimator_name = (str(estimate.params["estimator_class"])).split('.')
        estimator_name = [
            name for name in estimator_name if name.endswith('_estimator')][0]
        estimator_name = estimator_name.replace('_estimator', '')
        if 'propensity' in estimator_name or 'linear_regression' in estimator_name:
            estimator_name = 'backdoor.' + estimator_name
    return estimator_name
