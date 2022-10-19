#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import celery

from backend.exposure.inference.estimate_effect import estimate_effect
from backend.exposure.model.estimate_effect_models import EstimateResult, Specification
from backend.exposure.worker.worker import exposure_worker
from backend.worker_commons.io.db import get_db_client


@exposure_worker.task
def estimate_effect_for_specification(
    specification: Specification,
) -> EstimateResult:
    db_client = get_db_client()

    result = estimate_effect(
        specification=specification, task_id=celery.current_task.request.id
    )

    db_client.set_value(celery.current_task.request.id, result)

    return result
