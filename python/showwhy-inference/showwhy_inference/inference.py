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
from showwhy_inference.causal_graph import CausalGraph
from showwhy_inference.estimator import CausalEstimator
from showwhy_inference.inference_config import (DEFAULT_REFUTATION_TESTS,
                                                    SENSITIVITY_REFUTERS,
                                                    INCLUDE_SENSITIVITY_REFUTERS)

warnings.simplefilter('ignore')


def is_valid_spec(spec: List) -> bool:
    """
    Helper function to filter out obviously invalid specs
    """
    _, treatment_spec, outcome_spec, model_spec, estimator_spec = spec

    if (treatment_spec['variable'] != model_spec['treatment']) \
            or (outcome_spec['variable'] != model_spec['outcome']) \
            or (not model_spec['confounders'] and not model_spec['effect_modifiers'] and estimator_spec['require_propensity_score']):
        return False
    else:
        return True


def generate_all_specs(
        population_specs, treatment_specs, outcome_specs, model_specs, estimator_specs):
    """
    Generate all combinations of population, treatment, outcome, causal model and estimator
    """

    causal_graph = CausalGraph(treatment_specs, outcome_specs, model_specs)
    model_specs = causal_graph.create_gml_model_specs()

    specs = itertools.product(population_specs,
                              treatment_specs,
                              outcome_specs,
                              model_specs,
                              estimator_specs)

    return [spec for spec in specs if is_valid_spec(spec)]


def estimate_specification(spec: Tuple, context: Dict) -> Dict:
    start_time = time.time()
    causal_model, identified_estimand, estimate, population_size = __estimate_effect(
        population_spec=spec[0],
        treatment_spec=spec[1],
        outcome_spec=spec[2],
        model_spec=spec[3],
        estimator_spec=spec[4],
        context=context)
    result_dict = {
        'population_type': spec[0]['type'],
        'population_name': spec[0]['label'],
        'population_size': population_size,
        'treatment_type': spec[1]['type'],
        'treatment': spec[1]['label'],
        'outcome_type': spec[2]['type'],
        'outcome': spec[2]['label'],
        'causal_model': spec[3]['label'],
        'estimator': spec[4]['label'],
        'estimated_effect': (causal_model, identified_estimand, estimate),
        'time': time.time() - start_time
    }
    logging.info(f"Estimated effect: {result_dict}")
    return result_dict


def __estimate_effect(
        population_spec: Dict,
        treatment_spec: Dict,
        outcome_spec: List,
        model_spec: Dict,
        estimator_spec: Dict,
        context: Dict) -> Tuple[float, Dict]:
    """
    Estimate causal effect for a single analysis specification
    """
    # filter training data to create population
    all_data = context[population_spec['dataframe']]
    population_id = population_spec.get('population_id')
    if population_id is None:
        population_data = all_data
    else:
        population_data = all_data[all_data[population_id] == 1]

    treatment_var = treatment_spec['variable']
    population_data[treatment_var] = population_data[treatment_var].astype(
        bool)
    outcome_var = outcome_spec['variable']
    causal_graph = copy.deepcopy(model_spec['causal_graph'])
    logging.info(
        f"population: {population_spec['label']}, population_size: {population_data.shape[0]}, treatment: {treatment_var}, outcome: {outcome_var}, causal model: {model_spec['label']}, estimator: {estimator_spec['method_name']}")

    causal_model = dowhy.CausalModel(
        data=population_data,
        treatment=treatment_var,
        outcome=outcome_var,
        graph=causal_graph.replace("\n", " "),
        identify_vars=True)

    # identify estimands and check if estimate using backdoor criterion is possible
    identified_estimand = causal_model.identify_effect(
        proceed_when_unidentifiable=True)
    if identified_estimand.estimands['backdoor'] is not None:
        try:
            estimator = CausalEstimator()

            # tune first stage models
            if "propensity" in estimator_spec["method_name"] or "econml" in estimator_spec["method_name"]:
                estimator.model_classifier = estimator.tune_classifier_model(
                    identified_estimand, causal_model)
            if "dml" in estimator_spec["method_name"]:
                estimator.model_regressor = estimator.tune_dml_regressor_model(
                    identified_estimand, causal_model)
            elif "dr" in estimator_spec["method_name"]:
                estimator.model_regressor = estimator.tune_dr_regressor_model(
                    identified_estimand, causal_model)
            estimator_config = estimator.config_estimator(
                copy.deepcopy(estimator_spec))
            logging.info(f"Estimator config: {estimator_config}")

            estimate = causal_model.estimate_effect(identified_estimand,
                                                    method_name=estimator_config["method_name"],
                                                    method_params=estimator_config["method_params"])
            return causal_model, identified_estimand, estimate, population_data.shape[0]
        except Exception as e:
            logging.info(
                f"Cannot compute estimate: {e}. Returning None values")
            return None, None, None, population_data.shape[0]
    else:
        logging.info('Backdoor estimate is not possible')
        return None, None, None, population_data.shape[0]


def join_results(results: List) -> pd.DataFrame:
    """
    Join estimate, confidence interval, refutation and SHAP results
    """
    results_df = pd.DataFrame.from_dict(results)
    results_df = results_df[~results_df['estimated_effect'].isnull()]
    results_df = results_df.sort_values(by='estimated_effect')

    columns = [column for column in results_df.columns if not str(
        column).startswith('refuter') and not str(column).startswith('estimated')
        and str(column) != 'time' and str(column) != 'lower_bound' and str(column) != 'upper_bound'
        and str(column) != 'refutation_results']

    available_refuters = {
        column: np.sum for column in results_df.columns if column.startswith('refuter') or column.endswith('bound')}

    for column in results_df.columns:
        if column not in columns:
            results_df[column] = results_df[column].fillna(0)

    results_df = results_df.groupby(columns, sort=False).agg({
        'estimated_effect': np.mean,
        'time': np.mean,
        **available_refuters
    })

    # calculate final refutation result
    results_df['refutation_result'] = results_df.apply(
        lambda result: check_refutation_result(result), axis=1)

    results_df = results_df.reset_index().sort_values(
        by='estimated_effect')

    results_df.index = np.arange(1, len(results_df) + 1)
    results_df.index = results_df.index.set_names(['SpecificationID'])

    return results_df


def check_refutation_result(result: dict) -> int:
    """
    Helper function to output a single value representing refutation results for a given specification
    """
    if INCLUDE_SENSITIVITY_REFUTERS:
        refuters = set(
            [f'refuter_{refuter.replace("_refuter", "")}' for refuter in DEFAULT_REFUTATION_TESTS + SENSITIVITY_REFUTERS])
        sensitivity_refuters = set(
            [f'refuter_{refuter.replace("_refuter", "")}' for refuter in SENSITIVITY_REFUTERS])
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
            [f'refuter_{refuter.replace("_refuter", "")}' for refuter in DEFAULT_REFUTATION_TESTS])
        if not refuters.issubset(result.keys()):
            return -1
        else:
            for refuter in refuters:
                if result[refuter] != 1:
                    return 0
            return 2
