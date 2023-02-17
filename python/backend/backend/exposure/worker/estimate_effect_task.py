#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

import celery

from backend.exposure.inference.estimate_effect import estimate_effect
from backend.exposure.model.estimate_effect_models import EstimateResult, Specification
from backend.worker_commons.io.db import get_db_client
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def estimate_effect_for_specification(
    specification: Specification,
) -> EstimateResult:
    db_client = get_db_client()

    try:
        result = estimate_effect(specification=specification, task_id=celery.current_task.request.id)
    except Exception as exc:
        logging.error("Failed to estimate effect")
        result = EstimateResult(
            id=celery.current_task.request.id,
            population_type=specification.population.type,
            population_name=specification.population.label,
            population_size=len(specification.population.dataframe),
            treatment_type=specification.treatment.type,
            treatment=specification.treatment.label,
            outcome_type=specification.outcome.type,
            outcome=specification.outcome.label,
            causal_model=specification.model.label,
            estimator=specification.estimator.label,
            exc_info=str(exc),
        )

    db_client.set_value(celery.current_task.request.id, result)

    return result
