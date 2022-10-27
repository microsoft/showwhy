#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from fastapi import APIRouter, HTTPException

from backend.exposure.api import group_operations as go
from backend.exposure.inference.estimate_effect import get_tasks
from backend.exposure.model.estimate_effect_models import EstimateEffectRequestBody
from backend.exposure.model.response import NumberOfExecutionsResult
from backend.exposure.worker.estimate_effect_task import (
    estimate_effect_for_specification,
)
from backend.worker_commons.io.exceptions import DataFrameNotLoadedError
from backend.worker_commons.io.storage import get_storage_client

estimate_effect_router = APIRouter(
    prefix="/estimate_effect",
    tags=["estimate_effect"],
    responses={404: {"description": "Not Found"}},
)


@estimate_effect_router.post("/{workspace_name}")
async def estimate_effect(workspace_name: str, body: EstimateEffectRequestBody):
    storage_client = get_storage_client()
    try:
        specifications = get_tasks(
            storage_client,
            workspace_name,
            body.population_specs,
            body.treatment_specs,
            body.outcome_specs,
            body.model_specs,
            body.estimator_specs,
        )
    except DataFrameNotLoadedError as dfnle:
        logging.error("Failed to create tasks for estimate_effect")
        raise HTTPException(
            status_code=400,
            detail=f"{dfnle.dataframe_name} not uploaded for workspace: {dfnle.workspace_name}",
        )

    return go.schedule_task(
        workspace_name,
        "estimate_effect",
        estimate_effect_for_specification,
        [spec for spec in specifications if spec.is_valid()],
    )


@estimate_effect_router.get("/{workspace_name}/{task_id}")
async def fetch_results(workspace_name: str, task_id: str):
    return go.get_results(workspace_name, task_id, "estimate_effect").to_dict()


@estimate_effect_router.delete("/{workspace_name}/{task_id}")
async def cancel_task(workspace_name: str, task_id: str):
    return go.cancel_task(workspace_name, task_id, "estimate_effect")


@estimate_effect_router.post("/execution_count/{workspace_name}")
async def get_number_of_executions(
    workspace_name: str, body: EstimateEffectRequestBody
):

    outcome_models = [
        model for model in body.estimator_specs if model.type == "Outcome Model"
    ]
    treatment_models = [
        model
        for model in body.estimator_specs
        if model.type == "Treatment Assignment Model"
    ]
    outcomeSpecifications = get_tasks(
        None,
        workspace_name,
        body.population_specs,
        body.treatment_specs,
        body.outcome_specs,
        body.model_specs,
        outcome_models,
    )

    treatmentSpecifications = get_tasks(
        None,
        workspace_name,
        body.population_specs,
        body.treatment_specs,
        body.outcome_specs,
        body.model_specs,
        treatment_models,
    )

    outcome = NumberOfExecutionsResult(
        count=len([spec for spec in outcomeSpecifications if spec.is_valid()])
    )
    treatment = NumberOfExecutionsResult(
        count=len([spec for spec in treatmentSpecifications if spec.is_valid()])
    )

    return {
        "outcome": outcome,
        "treatment": treatment,
        "total": outcome.count + treatment.count,
    }
