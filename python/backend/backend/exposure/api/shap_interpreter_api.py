#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.exposure.api import group_operations as go
from backend.exposure.inference.specification_interpreter import get_tasks
from backend.exposure.model.response import NumberOfExecutionsResult
from backend.exposure.worker.shap_interpreter_task import shap_interpreter_task

shap_interpreter_router = APIRouter(
    prefix="/shap_interpreter",
    tags=["shap_interpreter"],
    responses={404: {"description": "Not Found"}},
)


class ShapInterpreterRequestBody(BaseModel):
    estimate_execution_id: str


@shap_interpreter_router.post("/{workspace_name}")
async def interpret(workspace_name: str, body: ShapInterpreterRequestBody):
    results = go.get_results(workspace_name, body.estimate_execution_id, "estimate_effect")

    if results.pending > 0:
        raise HTTPException(status_code=400, detail="Estimate Execution is not completed yet.")

    interpreter_specs = get_tasks(results.results)

    return go.schedule_task(workspace_name, "shap_interpreter", shap_interpreter_task, interpreter_specs)


@shap_interpreter_router.get("/{workspace_name}/{task_id}")
async def fetch_results(workspace_name: str, task_id: str):
    return go.get_results(workspace_name, task_id, "shap_interpreter").to_dict()


@shap_interpreter_router.delete("/{workspace_name}/{task_id}")
async def cancel_task(workspace_name: str, task_id: str):
    try:
        return go.cancel_task(workspace_name, task_id, "shap_interpreter")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@shap_interpreter_router.post("/execution_count/{workspace_name}")
async def get_number_of_executions(workspace_name: str, body: ShapInterpreterRequestBody):
    results = go.get_results(workspace_name, body.estimate_execution_id, "estimate_effect")

    if results.pending > 0:
        raise HTTPException(status_code=400, detail="Estimate Execution is not completed yet.")

    results_df = pd.DataFrame([result.to_dict() for result in results.results])

    return NumberOfExecutionsResult(count=len(results_df["outcome"].unique()))
