#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import celery
from celery import group

from backend.exposure import config
from backend.exposure.inference.significance_test import (
    compute_null_effect,
    get_propensity_scores,
)
from backend.exposure.model.significance_test_models import (
    ComputeNullEffectSpec,
    PropensityScoreSpec,
)
from backend.exposure.worker.worker import exposure_worker
from backend.worker_commons.io.db import get_db_client


@exposure_worker.task
def compute_null_effects(specs: List[ComputeNullEffectSpec]):
    group(
        [
            __compute_null_effect.s(specs)
            for _ in range(config.get_significance_simulations())
        ]
    )()


@exposure_worker.task
def calculate_propensity_score(
    specification: PropensityScoreSpec,
) -> ComputeNullEffectSpec:

    return get_propensity_scores(
        specification.identified_estimand,
        specification.causal_model,
        specification.estimate,
    )


@exposure_worker.task
def __compute_null_effect(specifications: List[ComputeNullEffectSpec]):
    db_client = get_db_client()

    result = compute_null_effect(specifications)

    db_client.set_value(
        f"{celery.current_task.request.parent_id}:{celery.current_task.request.id}",
        result,
    )

    return result
