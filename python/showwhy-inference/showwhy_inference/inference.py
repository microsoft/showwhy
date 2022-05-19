#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import copy
import itertools
import logging
import time
import warnings

from typing import Dict, List, Tuple

import dowhy
import numpy as np
import pandas as pd

from causallib.evaluation.weight_evaluator import calculate_covariate_balance
from sklearn import preprocessing

from showwhy_inference.causal_graph import CausalGraph
from showwhy_inference.estimator import CausalEstimator
from showwhy_inference.inference_config import (
    DEFAULT_REFUTATION_TESTS,
    INCLUDE_SENSITIVITY_REFUTERS,
    SENSITIVITY_REFUTERS,
)


warnings.simplefilter("ignore")


def stratification_covariate_balance(df, common_causes, treatments):
    df_long = df.melt(
        id_vars=treatments + ["strata", "propensity_score"],
        value_vars=common_causes,
        value_name="common_cause_value",
        var_name="covariate",
    )
    mean_diff = df_long.groupby(treatments + ["covariate", "strata"]).agg(
        mean_w=("common_cause_value", np.mean)
    )
    mean_diff = (
        mean_diff.groupby(["covariate", "strata"])
        .transform(lambda x: x.max() - x.min())
        .reset_index()
    )
    mean_diff = mean_diff.query(f"{treatments[0]}==True")
    size_by_w_strata = (
        df_long.groupby(["covariate", "strata"])
        .agg(size=("propensity_score", np.size))
        .reset_index()
    )
    size_by_strata = (
        df_long.groupby(["covariate"])
        .agg(size=("propensity_score", np.size))
        .reset_index()
    )
    size_by_strata = pd.merge(size_by_w_strata, size_by_strata, on="covariate")
    mean_diff_strata = pd.merge(mean_diff, size_by_strata, on=("covariate", "strata"))

    stddev_by_w_strata = (
        df_long.groupby(["covariate", "strata"])
        .agg(stddev=("common_cause_value", np.std))
        .reset_index()
    )
    mean_diff_strata = pd.merge(
        mean_diff_strata, stddev_by_w_strata, on=["covariate", "strata"]
    )
    mean_diff_strata["scaled_mean"] = (
        mean_diff_strata["mean_w"] / mean_diff_strata["stddev"]
    ) * (mean_diff_strata["size_x"] / mean_diff_strata["size_y"])
    mean_diff_strata = (
        mean_diff_strata.groupby("covariate")
        .agg(std_mean_diff=("scaled_mean", np.sum))
        .reset_index()
    )
    mean_diff_overall = df_long.groupby(treatments + ["covariate"]).agg(
        mean_w=("common_cause_value", np.mean)
    )
    mean_diff_overall = (
        mean_diff_overall.groupby("covariate")
        .transform(lambda x: x.max() - x.min())
        .reset_index()
    )
    mean_diff_overall = mean_diff_overall[mean_diff_overall[treatments[0]] is True]
    stddev_overall = (
        df_long.groupby(["covariate"])
        .agg(stddev=("common_cause_value", np.std))
        .reset_index()
    )
    mean_diff_overall = pd.merge(mean_diff_overall, stddev_overall, on=["covariate"])
    mean_diff_overall["std_mean_diff"] = (
        mean_diff_overall["mean_w"] / mean_diff_overall["stddev"]
    )
    mean_diff_overall = mean_diff_overall[["covariate", "std_mean_diff"]]
    mean_diff_strata["abs_smd"] = "adjusted"
    mean_diff_overall["abs_smd"] = "unadjusted"
    return pd.concat([mean_diff_overall, mean_diff_strata]).pivot_table(
        values="std_mean_diff", index=["covariate"], columns=["abs_smd"]
    )


def weighting_covariate_balance(df, common_causes, treatments):
    return calculate_covariate_balance(
        df[common_causes], df[treatments[0]], df["ips_weight"]
    ).rename(columns={"weighted": "adjusted", "unweighted": "unadjusted"})


COVARIATE_BALANCE_FUNC_MAPPING = {
    # TODO calculate covariate balance for score_matching
    "backdoor.propensity_score_matching": lambda df, **kwargs: pd.DataFrame(),
    "backdoor.propensity_score_stratification": stratification_covariate_balance,
    "backdoor.propensity_score_weighting": weighting_covariate_balance,
}


def is_valid_spec(spec: List) -> bool:
    """
    Helper function to filter out obviously invalid specs
    """
    _, treatment_spec, outcome_spec, model_spec, estimator_spec = spec
    if (
        (treatment_spec["variable"] != model_spec["treatment"])
        or (outcome_spec["variable"] != model_spec["outcome"])
        or (
            not model_spec["confounders"]
            and not model_spec["effect_modifiers"]
            and estimator_spec["require_propensity_score"]
        )
    ):
        return False
    else:
        return True


def generate_all_specs(
    population_specs, treatment_specs, outcome_specs, model_specs, estimator_specs
):
    """
    Generate all combinations of population, treatment,
    outcome, causal model and estimator
    """
    causal_graph = CausalGraph(treatment_specs, outcome_specs, model_specs)
    model_specs = causal_graph.create_gml_model_specs()
    specs = itertools.product(
        population_specs, treatment_specs, outcome_specs, model_specs, estimator_specs
    )
    return [spec for spec in specs if is_valid_spec(spec)]


def estimate_specification(spec: Tuple, context: Dict) -> Dict:
    start_time = time.time()
    (
        causal_model,
        identified_estimand,
        estimate,
        population_size,
        covariate_balance,
    ) = __estimate_effect(
        population_spec=spec[0],
        treatment_spec=spec[1],
        outcome_spec=spec[2],
        model_spec=spec[3],
        estimator_spec=spec[4],
        context=context,
    )
    result_dict = {
        "population_type": spec[0]["type"],
        "population_name": spec[0]["label"],
        "population_size": population_size,
        "treatment_type": spec[1]["type"],
        "treatment": spec[1]["label"],
        "outcome_type": spec[2]["type"],
        "outcome": spec[2]["label"],
        "causal_model": spec[3]["label"],
        "estimator": spec[4]["label"],
        "estimated_effect": (causal_model, identified_estimand, estimate),
        "covariate_balance": covariate_balance,
        "time": time.time() - start_time,
    }
    logging.info(f"Estimated effect: {result_dict}")
    return result_dict


def __estimate_effect(
    population_spec: Dict,
    treatment_spec: Dict,
    outcome_spec: List,
    model_spec: Dict,
    estimator_spec: Dict,
    context: Dict,
) -> Tuple[float, Dict]:
    """
    Estimate causal effect for a single analysis specification
    """
    # filter training data to create population
    all_data = context[population_spec["dataframe"]]
    population_id = population_spec.get("population_id")
    if population_id is None:
        population_data = all_data
    else:
        population_data = all_data[all_data[population_id] == 1]
    treatment_var = treatment_spec["variable"]
    outcome_var = outcome_spec["variable"]
    confounders = model_spec["confounders"]
    effect_modifiers = model_spec["effect_modifiers"]
    causal_variables = [treatment_var] + [outcome_var] + confounders + effect_modifiers
    population_data = population_data[causal_variables]
    population_data = population_data.dropna()
    # fix data types
    population_data[treatment_var] = population_data[treatment_var].astype(bool)
    # encode string columns
    le = preprocessing.LabelEncoder()
    for var in causal_variables:
        if population_data[var].dtype == object and isinstance(
            population_data.iloc[0][var], str
        ):
            population_data[var] = le.fit_transform(population_data[var])
    causal_graph = copy.deepcopy(model_spec["causal_graph"])
    logging.info(
        f"population: {population_spec['label']}, "
        f"population_size: {population_data.shape[0]}, "
        f"treatment: {treatment_var}, outcome: {outcome_var}, "
        f"causal model: {model_spec['label']}, "
        f"estimator: {estimator_spec['method_name']}"
    )
    causal_model = dowhy.CausalModel(
        data=population_data,
        treatment=treatment_var,
        outcome=outcome_var,
        graph=causal_graph.replace("\n", " "),
        identify_vars=True,
    )
    # identify estimands and check if estimate using backdoor criterion is possible
    identified_estimand = causal_model.identify_effect(proceed_when_unidentifiable=True)
    if identified_estimand.estimands["backdoor"] is not None:
        try:
            estimator = CausalEstimator()
            # tune first stage models
            if (
                "propensity" in estimator_spec["method_name"]
                or "econml" in estimator_spec["method_name"]
            ):
                estimator.model_classifier = estimator.tune_classifier_model(
                    identified_estimand, causal_model
                )
            if "dml" in estimator_spec["method_name"]:
                estimator.model_regressor = estimator.tune_dml_regressor_model(
                    identified_estimand, causal_model
                )
            elif "dr" in estimator_spec["method_name"]:
                estimator.model_regressor = estimator.tune_dr_regressor_model(
                    identified_estimand, causal_model
                )
            estimator_config = estimator.config_estimator(copy.deepcopy(estimator_spec))
            logging.info(f"Estimator config: {estimator_config}")
            estimate = causal_model.estimate_effect(
                identified_estimand,
                method_name=estimator_config["method_name"],
                method_params=estimator_config["method_params"],
            )
            if (
                "propensity" in estimator_spec["method_name"]
                and "matching" not in estimator_spec["method_name"]
            ):
                covariate_balance = COVARIATE_BALANCE_FUNC_MAPPING[
                    estimator_spec["method_name"]
                ](
                    estimate.estimator._data,
                    estimate.estimator._observed_common_causes_names,
                    estimate.estimator._treatment_name,
                ).to_dict()
            else:
                covariate_balance = None
            return (
                causal_model,
                identified_estimand,
                estimate,
                population_data.shape[0],
                covariate_balance,
            )
        except Exception as e:
            logging.info(f"Cannot compute estimate: {e}. Returning None values")
            return None, None, None, population_data.shape[0], None
    else:
        logging.info("Backdoor estimate is not possible")
        return None, None, None, population_data.shape[0], None


def join_results(results: List) -> pd.DataFrame:
    """
    Join estimate, confidence interval, refutation and SHAP results
    """
    results_df = pd.DataFrame.from_dict(results)
    results_df = results_df[~results_df["estimated_effect"].isnull()]
    results_df = results_df.sort_values(by="estimated_effect")
    columns = [
        column
        for column in results_df.columns
        if not str(column).startswith("refuter")
        and not str(column).startswith("estimated")
        and str(column) != "time"
        and str(column) != "lower_bound"
        and str(column) != "upper_bound"
        and str(column) != "refutation_results"
        and str(column) != "covariate_balance"
    ]
    available_refuters = {
        column: np.sum
        for column in results_df.columns
        if column.startswith("refuter") or column.endswith("bound")
    }
    for column in results_df.columns:
        if column not in columns:
            results_df[column] = results_df[column].fillna(0)

    if "covariate_balance" in results_df.columns:
        covariate_agg = {
            "covariate_balance": 'first'
        }
    else:
        covariate_agg = {}

    results_df = results_df.groupby(columns, sort=False).agg(
        {
            "estimated_effect": np.mean,
            "time": np.mean,
            **covariate_agg,
            **available_refuters,
        }
    )
    # calculate final refutation result
    results_df["refutation_result"] = results_df.apply(
        lambda result: check_refutation_result(result), axis=1
    )
    results_df = results_df.reset_index().sort_values(by="estimated_effect")
    results_df.index = np.arange(1, len(results_df) + 1)
    results_df.index = results_df.index.set_names(["SpecificationID"])
    return results_df


def check_refutation_result(result: dict) -> int:
    """
    Helper function to output a single value representing
    refutation results for a given specification
    """
    if INCLUDE_SENSITIVITY_REFUTERS:
        refuters = set(
            [
                f'refuter_{refuter.replace("_refuter", "")}'
                for refuter in DEFAULT_REFUTATION_TESTS + SENSITIVITY_REFUTERS
            ]
        )
        sensitivity_refuters = set(
            [
                f'refuter_{refuter.replace("_refuter", "")}'
                for refuter in SENSITIVITY_REFUTERS
            ]
        )
        if not refuters.issubset(result.keys()):
            return -1
        else:
            fail_sensitivity_test = False
            for refuter in refuters:
                if result[refuter] != 1:
                    if refuter not in sensitivity_refuters:
                        return 0
                    else:
                        fail_sensitivity_test = True
            if fail_sensitivity_test:
                return 1
            else:
                return 2
    else:
        refuters = set(
            [
                f'refuter_{refuter.replace("_refuter", "")}'
                for refuter in DEFAULT_REFUTATION_TESTS
            ]
        )
        if not refuters.issubset(result.keys()):
            return -1
        else:
            for refuter in refuters:
                if result[refuter] != 1:
                    return 0
            return 2
