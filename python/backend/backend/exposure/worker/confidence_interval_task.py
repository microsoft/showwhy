#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

import celery

from backend.exposure.inference.confidence_interval import estimate_confidence_intervals
from backend.exposure.model.confidence_interval_models import ConfidenceIntervalParams, ConfidenceIntervalResult
from backend.worker_commons.io.db import get_db_client
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def confidence_interval_task(
    specification: ConfidenceIntervalParams,
) -> ConfidenceIntervalResult:
    db_client = get_db_client()
    estimated_effect = specification.estimate

    if specification.estimate.exc_info is not None:
        return ConfidenceIntervalResult(
            estimate_id=estimated_effect.id,
            exc_info=specification.estimate.exc_info,
        )

    try:
        result = estimate_confidence_intervals(estimated_effect)
    except Exception as exc:
        logging.error("Failed to estimate confidence intervals")
        return ConfidenceIntervalResult(
            estimate_id=estimated_effect.id,
            exc_info=str(exc),
        )

    db_client.set_value(celery.current_task.request.id, result)

    return result
