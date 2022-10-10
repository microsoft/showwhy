#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import celery

from backend.exposure.inference.confidence_interval import estimate_confidence_intervals
from backend.exposure.io.db import get_db_client
from backend.exposure.model.confidence_interval_models import (
    ConfidenceIntervalParams,
    ConfidenceIntervalResult,
)
from backend.exposure.worker.worker import exposure_worker


@exposure_worker.task
def confidence_interval_task(
    specification: ConfidenceIntervalParams,
) -> ConfidenceIntervalResult:
    db_client = get_db_client()
    estimated_effect = specification.estimate

    result = estimate_confidence_intervals(estimated_effect)

    db_client.set_value(celery.current_task.request.id, result)

    return result
