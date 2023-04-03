#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json
import logging
import os
from typing import Dict, List
from uuid import uuid4

import nbformat as nbf
from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.exposure.model.estimate_effect_models import EstimateEffectRequestBody

logger = logging.getLogger(__name__)

notebook_router = APIRouter(
    prefix="/notebook",
    tags=["notebook"],
    responses={404: {"description": "Not Found"}},
)


class RefuteEstimateParams(BaseModel):
    num_simulations_map: Dict[str, int]


class ConfidenceIntervalParams(BaseModel):
    estimate_execution_ids: List[str]


class EstimateEffectFilter(BaseModel):
    population_type: str
    treatment_type: str
    outcome_type: str
    causal_model: str
    estimator: str


class SignificanceTestParams(BaseModel):
    filter_by: List[EstimateEffectFilter]


class NotebookRequestBody(BaseModel):
    workspace_name: str
    estimate_effect_params: EstimateEffectRequestBody
    refuter_params: RefuteEstimateParams
    significance_test_params: SignificanceTestParams
    confidence_interval_params: ConfidenceIntervalParams


def __get_estimate_effect_params_cell(body: EstimateEffectRequestBody):
    return f"""import json
estimate_effect_spec = json.loads(\"\"\"{body.json(indent=2)}\"\"\")"""


def __get_estimate_effect_execution_cell():
    return """import pandas as pd

import backend.exposure.inference.estimate_effect as estimator

from backend.exposure.model.estimate_effect_models import EstimateEffectRequestBody
from backend.worker_commons.io.storage import NotebookLocalStorageClient

estimate_effect_input = EstimateEffectRequestBody(**estimate_effect_spec)

specifications = estimator.get_tasks(
    NotebookLocalStorageClient("./data/"),
    "local_notebook",
    estimate_effect_input.population_specs,
    estimate_effect_input.treatment_specs,
    estimate_effect_input.outcome_specs,
    estimate_effect_input.model_specs,
    estimate_effect_input.estimator_specs,
)

valid_specifications = [spec for spec in specifications if spec.is_valid()]



estimated_effects = [
    estimator.estimate_effect(spec, task_id=index) for index, spec in enumerate(valid_specifications)
]

estimated_effects_df = pd.DataFrame([effect.to_dict() for effect in estimated_effects])
estimated_effects_df"""


def __get_refutation_execution_cell(num_simulations_map: Dict[str, int]):
    return f"""import backend.exposure.inference.refutation as refutation

num_simulations_map = {num_simulations_map}
refuters = ["random_common_cause", "placebo_treatment_refuter"]

refuter_specifications = refutation.get_tasks(num_simulations_map, estimated_effects, refuters)
refutation_results = [refutation.refute_estimate(spec) for spec in refuter_specifications]

refutation_df = pd.DataFrame([result.to_dict() for result in refutation_results]).rename({{'estimate_id': 'id', 'result': 'refuter_result'}}, axis=1)
refutation_df = pd.merge(estimated_effects_df, refutation_df, how='inner', on='id')
refutation_df"""


def __get_confidence_intervals_execution_cell(estimate_execution_ids: List[str]):
    return f"""import backend.exposure.inference.confidence_interval as ci

estimate_execution_ids = {estimate_execution_ids}
confidence_specs = ci.get_tasks(estimated_effects, estimate_execution_ids)

confidence_intervals = [
    ci.estimate_confidence_intervals(
        spec.estimate,
        confidence_level=0.95, 
        sample_size_fraction=1.0
    )
for spec in confidence_specs]


confidence_intervals_df = pd.DataFrame([interval.to_dict() for interval in confidence_intervals]).rename({{'estimate_id': 'id'}}, axis=1)
confidence_intervals_df = pd.merge(refutation_df, confidence_intervals_df, on='id')
confidence_intervals_df"""


def __get_shap_interpreter_execution_cell():
    return """import backend.exposure.inference.specification_interpreter as si

shap_interpreter_specs = si.get_tasks(estimated_effects)

interpreter_results = [
    si.interpret(
        spec.outcome_result, 
        spec_features=[
            "population_name",
            "treatment",
            "outcome",
            "causal_model",
            "estimator",
        ],
    )
for spec in shap_interpreter_specs]

shap_interpreter_df = confidence_intervals_df.copy()

for result in interpreter_results:
    result_df = pd.DataFrame(result.to_dict()).rename({'estimate_id': 'id'}, axis=1)
    shap_interpreter_df = pd.merge(shap_interpreter_df, result_df, on='id')
shap_interpreter_df"""


def __get_significance_test_execution_cell(params: SignificanceTestParams):
    return f"""import backend.exposure.inference.significance_test as st
from backend.exposure.model.significance_test_models import PropensityScoreSpec

num_simulations = 100

filter_by = json.loads(\"\"\"{json.dumps([dict(filter) for filter in params.filter_by], indent=2)}\"\"\")

ids = [estimated_effects_df[
        (estimated_effects_df["population_type"] == filter["population_type"]) &
        (estimated_effects_df["treatment_type"] == filter["treatment_type"]) &
        (estimated_effects_df["outcome_type"] == filter["outcome_type"]) &
        (estimated_effects_df["causal_model"] == filter["causal_model"]) &
        (estimated_effects_df["estimator"] == filter["estimator"])
]['id'].iloc[0] for filter in filter_by]


propensity_score_specs = [PropensityScoreSpec(
    estimate_id=result.id,
    identified_estimand=result.identified_estimand,
    causal_model=result.causal_model_graph,
    estimate=result.estimate,
) for result in estimated_effects if result.id in ids]

propensity_scores = [st.get_propensity_scores(spec.identified_estimand, spec.causal_model, spec.estimate) for spec in propensity_score_specs]

null_effects = [st.compute_null_effect(propensity_scores) for _ in range(num_simulations)]

extreme_results = [
    effect
    for effect, original_effect in null_effects
    if (effect >= original_effect and original_effect >= 0)
    or (effect <= original_effect and original_effect < 0)
]
p_value = len(extreme_results) / len(null_effects)
significance = p_value <= 0.05
if p_value < 0.001:
    p_value_str = "p<0.001"
elif p_value < 0.01:
    p_value_str = "p<0.01"
elif p_value < 0.05:
    p_value_str = "p<0.05"
else:
    p_value_str = "p>0.05"

print(p_value_str)"""


@notebook_router.post("/")
async def generate_notebook(body: NotebookRequestBody):
    notebook = nbf.v4.new_notebook()

    notebook["cells"] = [
        nbf.v4.new_markdown_cell("# Install deps"),
        nbf.v4.new_code_cell("%pip install git+https://github.com/microsoft/showwhy/#subdirectory=python/backend"),
        nbf.v4.new_markdown_cell("# Estimate Effect"),
        nbf.v4.new_code_cell(__get_estimate_effect_params_cell(body.estimate_effect_params)),
        nbf.v4.new_code_cell(__get_estimate_effect_execution_cell()),
        nbf.v4.new_markdown_cell("# Refute Estimate"),
        nbf.v4.new_code_cell(__get_refutation_execution_cell(body.refuter_params.num_simulations_map)),
        nbf.v4.new_markdown_cell("# Confidence Intervals"),
        nbf.v4.new_code_cell(
            __get_confidence_intervals_execution_cell(body.confidence_interval_params.estimate_execution_ids)
        ),
        nbf.v4.new_markdown_cell("# SHAP Interpreter"),
        nbf.v4.new_code_cell(__get_shap_interpreter_execution_cell()),
        nbf.v4.new_markdown_cell("# Significance Test"),
        nbf.v4.new_code_cell(__get_significance_test_execution_cell(body.significance_test_params)),
    ]
    nb_name = os.path.join("/tmp", f"{str(uuid4())}.ipynb")
    nbf.write(notebook, nb_name)
    return FileResponse(nb_name)
