#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import celery

from backend.exposure.inference.specification_interpreter import interpret
from backend.exposure.model.shap_interpreter_models import (
    ListShapInterpreterResult,
    ShapInterpreterSpec,
)
from backend.exposure.worker.worker import exposure_worker
from backend.worker_commons.io.db import get_db_client


@exposure_worker.task
def shap_interpreter_task(
    specification: ShapInterpreterSpec,
) -> ListShapInterpreterResult:
    db_client = get_db_client()

    result = interpret(
        spec_results=specification.outcome_result,
        spec_features=[
            "population_name",
            "treatment",
            "outcome",
            "causal_model",
            "estimator",
        ],
    )

    db_client.set_value(celery.current_task.request.id, result)

    return result
