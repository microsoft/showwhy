#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

import celery

from backend.exposure.inference.refutation import refute_estimate
from backend.exposure.model.refute_estimate_models import RefuterResult, RefuterSpec
from backend.worker_commons.io.db import get_db_client
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def refute_estimate_task(
    specification: RefuterSpec,
) -> RefuterResult:
    db_client = get_db_client()

    if specification.estimate.exc_info is not None:
        return RefuterResult(
            estimate_id=specification.estimate_id,
            exc_info=specification.estimate.exc_info,
        )

    try:
        result = refute_estimate(specification)
    except Exception as exc:
        logging.error("Failed to refute estimate")
        return RefuterResult(
            estimate_id=specification.estimate_id,
            exc_info=str(exc),
        )

    db_client.set_value(celery.current_task.request.id, result)

    return result
