#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numpy as np
import pandas as pd

from backend.exposure.inference.estimator import CausalEstimator
from backend.exposure.model.significance_test_models import ComputeNullEffectSpec


def __get_propensity_scores(identified_estimand, causal_model, common_causes):
    treatment_var = identified_estimand.treatment_variable
    propensity_model = CausalEstimator().tune_classifier_model(identified_estimand, causal_model)

    propensity_model.fit(
        causal_model._data[common_causes],
        causal_model._data[treatment_var],
    )

    return pd.Series(propensity_model.predict_proba(causal_model._data[common_causes])[:, 1])


def __generate_bootstrap_sample(treatment_var, causal_model):
    """
    Generate bootstrapped sample by randomly shuffling
         treatment values within each stratum
    """
    if "sig_strata" in causal_model._data.columns:
        return causal_model._data.groupby("sig_strata")[treatment_var].transform(np.random.permutation)
    else:
        return causal_model._data[treatment_var].transform(np.random.permutation)


def get_propensity_scores(identified_estimand, causal_model, estimate):
    common_causes = identified_estimand.get_backdoor_variables()

    if len(common_causes) > 0:
        causal_model._data["propensity_score"] = __get_propensity_scores(
            identified_estimand, causal_model, common_causes
        )
        causal_model._data["sig_strata"] = (
            (causal_model._data["propensity_score"].rank(ascending=True) / causal_model._data.shape[0]) * 5
        ).round(0)

    causal_model._data.dropna(inplace=True)
    return ComputeNullEffectSpec(
        estimate=estimate,
        identified_estimand=identified_estimand,
        causal_model=causal_model,
        original_effect=estimate.value,
    )


def compute_null_effect(specifications):
    values = []
    original = []
    for specification in specifications:
        causal_model = specification.causal_model
        treatment_var = specification.identified_estimand.treatment_variable
        causal_model._data[treatment_var] = __generate_bootstrap_sample(treatment_var, specification.causal_model)

        estimate = causal_model.estimate_effect(
            specification.identified_estimand,
            # TODO: temporary fix until we update to the new dowhy API
            method_name=specification.estimate.__method_name,
            method_params=specification.estimate.__method_params,
        )
        original.append(specification.original_effect)
        values.append(estimate.value)

    return np.nanmedian(values), np.nanmedian(original)
