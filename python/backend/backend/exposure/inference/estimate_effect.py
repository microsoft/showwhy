#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import itertools
import logging
from uuid import uuid4

import dowhy
import pandas as pd
from sklearn import preprocessing

from backend.exposure.inference.causal_graph import create_gml_model_specs
from backend.exposure.inference.covariate_balance import COVARIATE_BALANCE_FUNC_MAPPING
from backend.exposure.inference.estimator import CausalEstimator
from backend.exposure.model.estimate_effect_models import EstimateResult, PopulationSpecDataFrame, Specification
from backend.worker_commons.io.exceptions import DataFrameNotLoadedError, FileNotFoundError


def get_tasks(
    storage_client,
    workspace_name,
    population_specs,
    treatment_specs,
    outcome_specs,
    model_specs,
    estimator_specs,
):

    population_df_specs = []
    for population_spec in population_specs:
        if population_spec.dataframe is not None and isinstance(population_spec.dataframe, str):
            try:
                population_df_specs.append(
                    PopulationSpecDataFrame(
                        type=population_spec.type,
                        label=population_spec.label,
                        dataframe=storage_client.read(workspace_name, population_spec.dataframe)
                        if storage_client is not None
                        else pd.DataFrame(),
                        variable=population_spec.variable,
                    )
                )
            except FileNotFoundError:
                logging.error(f"Failed to get dataframe: {population_spec.dataframe} for workspace: {workspace_name}")
                raise DataFrameNotLoadedError(workspace_name, population_spec.dataframe)

    model_specs_with_causal_graph = create_gml_model_specs(treatment_specs, outcome_specs, model_specs)

    return [
        Specification(
            population=population,
            treatment=treatment,
            outcome=outcome,
            model=model,
            estimator=estimator,
        )
        for population, treatment, outcome, model, estimator in itertools.product(
            population_df_specs,
            treatment_specs,
            outcome_specs,
            model_specs_with_causal_graph,
            estimator_specs,
        )
    ]


def __prepare_data(population, treatment, outcome, confounders, effect_modifiers) -> pd.DataFrame:
    data = population.dataframe

    variable = population.variable
    if variable is not None:
        data = data[data[variable] == 1]

    causal_variables = [treatment, outcome] + confounders + effect_modifiers
    population_data = data[causal_variables]
    population_data = population_data.dropna()

    population_data[treatment] = population_data[treatment].astype(bool)
    le = preprocessing.LabelEncoder()
    for var in causal_variables:
        if population_data[var].dtype == object and isinstance(population_data.iloc[0][var], str):
            population_data[var] = le.fit_transform(population_data[var])

    return population_data, treatment, outcome


def __get_estimator_config(estimator, identified_estimand, causal_model):
    causal_estimator = CausalEstimator()
    if any(word in estimator.method_name for word in ["propensity", "econml"]):
        causal_estimator.model_classifier = causal_estimator.tune_classifier_model(identified_estimand, causal_model)

    if "dml" in estimator.method_name:
        causal_estimator.model_regressor = causal_estimator.tune_dml_regressor_model(identified_estimand, causal_model)
    elif "dr" in estimator.method_name:
        causal_estimator.model_regressor = causal_estimator.tune_dr_regressor_model(identified_estimand, causal_model)

    return causal_estimator.config_estimator(
        {
            "type": estimator.type,
            "label": estimator.label,
            "require_propensity_score": estimator.require_propensity_score,
            "method_params": estimator.method_params,
            "method_name": estimator.method_name,
        }
    )


def __get_covariate_balance(estimator, estimate):
    covariate_balance_fn = COVARIATE_BALANCE_FUNC_MAPPING[estimator.method_name]

    if covariate_balance_fn:
        return covariate_balance_fn(
            estimate.estimator._data,
            estimate.estimator._observed_common_causes_names,
            estimate.estimator._treatment_name,
        )
    else:
        return None


def estimate_effect(specification: Specification, task_id=None):
    population_data, treatment, outcome = __prepare_data(
        specification.population,
        specification.treatment.variable,
        specification.outcome.variable,
        specification.model.confounders,
        specification.model.effect_modifiers,
    )

    causal_model = dowhy.CausalModel(
        data=population_data,
        treatment=treatment,
        outcome=outcome,
        graph=specification.model.causal_graph,
        identify_vars=True,
    )

    identified_estimand = causal_model.identify_effect(proceed_when_unidentifiable=True, optimize_backdoor=False)
    if identified_estimand.estimands["backdoor"] is None:
        return None

    estimator_config = __get_estimator_config(specification.estimator, identified_estimand, causal_model)
    estimate = causal_model.estimate_effect(
        identified_estimand,
        method_name=estimator_config["method_name"],
        method_params=estimator_config["method_params"],
    )

    covariate_balance = __get_covariate_balance(specification.estimator, estimate)

    return EstimateResult(
        id=task_id if task_id is not None else str(uuid4()),
        population_type=specification.population.type,
        population_name=specification.population.label,
        population_size=population_data.shape[0],
        treatment_type=specification.treatment.type,
        treatment=specification.treatment.label,
        outcome_type=specification.outcome.type,
        outcome=specification.outcome.label,
        causal_model=specification.model.label,
        estimator=specification.estimator.label,
        causal_model_graph=causal_model,
        identified_estimand=identified_estimand,
        estimate=estimate,
        covariate_balance=covariate_balance,
    )
