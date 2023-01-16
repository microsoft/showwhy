#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from celery import chord, states
from celery.result import AsyncResult
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.exposure import config
from backend.exposure.api import group_operations as go
from backend.exposure.model.response import NumberOfExecutionsResult, StatusModel
from backend.exposure.model.significance_test_models import PropensityScoreSpec, SignificanceTestResult
from backend.exposure.worker.significance_test_task import calculate_propensity_score, compute_null_effects
from backend.worker_commons.io.db import get_db_client

significance_test_router = APIRouter(
    prefix="/significance_test",
    tags=["significance_test"],
    responses={404: {"description": "Not Found"}},
)


class SignificanceTestRequestBody(BaseModel):
    estimate_execution_id: str
    estimate_execution_ids: List[str]


@significance_test_router.post("/{workspace_name}")
async def significance_test(workspace_name: str, body: SignificanceTestRequestBody):
    results = go.get_results(workspace_name, body.estimate_execution_id, "estimate_effect")

    if results.pending > 0:
        raise HTTPException(status_code=400, detail="Estimate Execution is not completed yet.")

    filtered_estimates = [
        PropensityScoreSpec(
            estimate_id=result.id,
            identified_estimand=result.identified_estimand,
            causal_model=result.causal_model_graph,
            estimate=result.estimate,
        )
        for result in results.results
        if result.id in body.estimate_execution_ids
    ]

    propensity_score_async = chord([calculate_propensity_score.s(estimate) for estimate in filtered_estimates])(
        compute_null_effects.s()
    )

    return {"id": propensity_score_async.id}


@significance_test_router.get("/{workspace_name}/{task_id}")
async def fetch_results(workspace_name: str, task_id: str):
    db_client = get_db_client()

    results = [result for result in db_client.iter_values(task_id)]
    results = [db_client.get_value(result) for result in results]

    total = config.get_significance_simulations()

    if len(results) < total:
        return StatusModel(
            status=states.STARTED,
            completed=len(results),
            pending=total - len(results),
            failed=0,
            results=None,
        )
    else:
        extreme_results = [
            effect
            for effect, original_effect in results
            if (effect >= original_effect and original_effect >= 0)
            or (effect <= original_effect and original_effect < 0)
        ]
        p_value = len(extreme_results) / len(results)
        significance = p_value <= 0.05
        if p_value < 0.001:
            p_value_str = "p<0.001"
        elif p_value < 0.01:
            p_value_str = "p<0.01"
        elif p_value < 0.05:
            p_value_str = "p<0.05"
        else:
            p_value_str = "p>0.05"
        return StatusModel(
            status=states.SUCCESS,
            completed=len(results),
            pending=total - len(results),
            failed=0,
            results=SignificanceTestResult(p_value=p_value_str, significance=significance),
        )


@significance_test_router.delete("/{workspace_name}/{task_id}")
async def cancel_task(workspace_name: str, task_id: str):
    return AsyncResult(task_id).revoke(terminate=True)


@significance_test_router.post("/execution_count/{workspace_name}")
async def get_number_of_executions(workspace_name: str, body: SignificanceTestRequestBody):
    return NumberOfExecutionsResult(count=config.get_significance_simulations())
