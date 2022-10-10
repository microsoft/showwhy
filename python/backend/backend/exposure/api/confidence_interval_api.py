#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.exposure.api import group_operations as go
from backend.exposure.inference.confidence_interval import get_tasks
from backend.exposure.model.response import NumberOfExecutionsResult
from backend.exposure.worker.confidence_interval_task import confidence_interval_task

confidence_interval_router = APIRouter(
    prefix="/confidence_interval",
    tags=["confidence_interval"],
    responses={404: {"description": "Not Found"}},
)


class ConfidenceIntervalRequestBody(BaseModel):
    estimate_execution_ids: List[str]
    estimate_execution_id: str


@confidence_interval_router.post("/{workspace_name}")
async def confidence_interval(workspace_name: str, body: ConfidenceIntervalRequestBody):
    results = go.get_results(
        workspace_name, body.estimate_execution_id, "estimate_effect"
    )

    if results.pending > 0:
        raise HTTPException(
            status_code=400, detail="Estimate Execution is not completed yet."
        )

    confidence_params = get_tasks(results.results, body.estimate_execution_ids)

    return go.schedule_task(
        workspace_name,
        "confidence_interval",
        confidence_interval_task,
        confidence_params,
    )


@confidence_interval_router.get("/{workspace_name}/{task_id}")
async def fetch_results(workspace_name: str, task_id: str):
    return go.get_results(workspace_name, task_id, "confidence_interval").to_dict()


@confidence_interval_router.delete("/{workspace_name}/{task_id}")
async def cancel_task(workspace_name: str, task_id: str):
    return go.cancel_task(workspace_name, task_id, "confidence_interval")


@confidence_interval_router.post("/execution_count/{workspace_name}")
async def get_number_of_executions(
    workspace_name: str, body: ConfidenceIntervalRequestBody
):
    results = go.get_results(
        workspace_name, body.estimate_execution_id, "estimate_effect"
    )

    if results.pending > 0:
        raise HTTPException(
            status_code=400, detail="Estimate Execution is not completed yet."
        )

    return NumberOfExecutionsResult(count=len(results.results))
