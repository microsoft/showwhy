#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

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

    result = refute_estimate(specification)

    db_client.set_value(celery.current_task.request.id, result)

    return result
