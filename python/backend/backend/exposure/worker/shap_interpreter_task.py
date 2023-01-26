#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import celery

from backend.exposure.inference.specification_interpreter import interpret
from backend.exposure.model.shap_interpreter_models import ListShapInterpreterResult, ShapInterpreterSpec
from backend.worker_commons.io.db import get_db_client
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def shap_interpreter_task(
    specification: ShapInterpreterSpec,
) -> ListShapInterpreterResult:
    db_client = get_db_client()

    try:
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
    except Exception as exc:
        print("Failed to interpret specification", exc_info=True)
        return ListShapInterpreterResult(
            estimate_id=specification.outcome_result.id,
            exc_info=str(exc),
        )

    db_client.set_value(celery.current_task.request.id, result)

    return result
