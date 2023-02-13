#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.exposure.api import group_operations as go
from backend.exposure.config import get_refuters
from backend.exposure.inference.refutation import get_tasks
from backend.exposure.model.response import NumberOfExecutionsResult
from backend.exposure.worker.refute_estimate_task import refute_estimate_task

refute_estimate_router = APIRouter(
    prefix="/refute_estimate",
    tags=["refute_estimate"],
    responses={404: {"description": "Not Found"}},
)


class RefuteEstimateRequestBody(BaseModel):
    num_simulations_map: Dict[str, int]
    estimate_execution_id: str


@refute_estimate_router.post("/{workspace_name}")
async def refute_estimate(workspace_name: str, body: RefuteEstimateRequestBody):
    results = go.get_results(workspace_name, body.estimate_execution_id, "estimate_effect")

    if results.pending > 0:
        raise HTTPException(status_code=400, detail="Estimate Execution is not completed yet.")

    refuter_specs = get_tasks(body.num_simulations_map, results.results, get_refuters())

    return go.schedule_task(workspace_name, "refute_estimate", refute_estimate_task, refuter_specs)


@refute_estimate_router.get("/{workspace_name}/{task_id}")
async def fetch_results(workspace_name: str, task_id: str):
    return go.get_results(workspace_name, task_id, "refute_estimate").to_dict()


@refute_estimate_router.delete("/{workspace_name}/{task_id}")
async def cancel_task(workspace_name: str, task_id: str):
    try:
        return go.cancel_task(workspace_name, task_id, "refute_estimate")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@refute_estimate_router.post("/execution_count/{workspace_name}")
async def get_number_of_executions(workspace_name: str, body: RefuteEstimateRequestBody):
    results = go.get_results(workspace_name, body.estimate_execution_id, "estimate_effect")

    if results.pending > 0:
        raise HTTPException(status_code=400, detail="Estimate Execution is not completed yet.")

    refuters = get_refuters()
    return NumberOfExecutionsResult(count=len(results.results) * len(refuters))
