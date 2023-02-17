#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from collections import defaultdict
from typing import Any, List

from celery import group, states
from celery.result import AsyncResult

from backend.exposure.model.response import StatusModel
from backend.worker_commons.io.db import get_db_client


def schedule_task(workspace_name: str, task_name: str, task: Any, params: List):
    db_client = get_db_client()
    async_group = group([task.s(specification=specification) for specification in params])

    results = async_group()

    tasks_ids = [task.id for task in results.results]

    db_client.set_value(
        f"{workspace_name}:{task_name}:{results.id}",
        tasks_ids,
    )

    return {"id": results.id, "total": len(tasks_ids)}


def get_async_result(workspace_name: str, group_id: str, task_name: str):
    db_client = get_db_client()
    ids = db_client.get_value(f"{workspace_name}:{task_name}:{group_id}")
    results = [AsyncResult(id) for id in ids]

    results_dict = defaultdict(lambda: [])

    for result in results:
        results_dict[result.status].append(result)

    return results_dict


def get_results(workspace_name: str, group_id: str, task_name: str):
    db_client = get_db_client()

    results = get_async_result(workspace_name, group_id, task_name)

    completed_results = [db_client.get_value(result.id) for result in results[states.SUCCESS] + results[states.PENDING]]

    succeeded_results = [result for result in completed_results if result is not None and result.exc_info is None]
    failed_results = [result for result in completed_results if result is not None and result.exc_info is not None]

    total_tasks = len(
        results[states.SUCCESS] + results[states.PENDING] + results[states.FAILURE] + results[states.REVOKED]
    )

    status = states.PENDING
    if len(results[states.PENDING]) < total_tasks:
        status = states.STARTED
    if len(results[states.FAILURE]) + len(failed_results) > 0:
        status = states.FAILURE
    if len(succeeded_results) == total_tasks:
        status = states.SUCCESS
    if len(results[states.REVOKED]) > 0:
        status = states.REVOKED

    return StatusModel(
        status=status,
        completed=len(succeeded_results),
        pending=total_tasks - len(succeeded_results) - len(results[states.FAILURE]) - len(failed_results),
        failed=len(results[states.FAILURE]) + len(failed_results),
        results=succeeded_results,
        failures=failed_results,
    )


def cancel_task(workspace_name: str, group_id: str, task_name: str):
    db_client = get_db_client()
    ids = db_client.get_value(f"{workspace_name}:{task_name}:{group_id}")

    if ids is None:
        raise ValueError(f"Task {group_id} not found for workspace {workspace_name} and task {task_name}")

    for id in ids:
        AsyncResult(id).revoke(terminate=True)

    return {"status": states.REVOKED}
