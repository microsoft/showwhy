#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict, List, Optional

import celery.states as states
import pandas as pd
from celery.result import AsyncResult
from fastapi import APIRouter
from pydantic import BaseModel

from backend.exposure.worker.identify_estimand_task import identify_estimand_task
from backend.worker_commons.io.storage import get_storage_client

identify_estimand_router = APIRouter(
    prefix="/identify_estimand",
    tags=["identify_estimand"],
    responses={404: {"description": "Not Found"}},
)


class CreateCausalModelRequestBody(BaseModel):
    treatment: str
    outcome: str
    controls: List[str]
    causal_graph: Dict
    dataframe: str = None


@identify_estimand_router.post("/{workspace_name}")
async def identify_estimand(workspace_name: str, body: CreateCausalModelRequestBody):
    dataframe: Optional[pd.DataFrame] = None

    if body.dataframe:
        storage_client = get_storage_client()
        dataframe = storage_client.read(workspace_name, body.dataframe)

    async_task = identify_estimand_task.delay(
        workspace_name,
        body.causal_graph,
        dataframe,
        body.controls,
        body.treatment,
        body.outcome,
    )
    return {"id": async_task.id}


@identify_estimand_router.get("/{workspace_name}/{task_id}")
async def status(workspace_name: str, task_id: str):
    async_task = AsyncResult(task_id)
    if async_task.status == states.SUCCESS:
        return async_task.get().to_dict()
    else:
        return {"status": async_task.status}
