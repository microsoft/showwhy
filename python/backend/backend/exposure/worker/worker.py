#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from celery import Celery

from backend.worker_commons import config

exposure_worker = Celery(
    "app", backend=config.get_redis_url(), broker=config.get_redis_url()
)
exposure_worker.conf.task_serializer = "pickle"
exposure_worker.conf.result_serializer = "pickle"
exposure_worker.conf.accept_content = [
    "application/json",
    "application/x-python-serialize",
]
exposure_worker.autodiscover_tasks(
    [
        "backend.exposure.worker.identify_estimand_task",
        "backend.exposure.worker.estimate_effect_task",
        "backend.exposure.worker.refute_estimate_task",
        "backend.exposure.worker.confidence_interval_task",
        "backend.exposure.worker.shap_interpreter_task",
        "backend.exposure.worker.significance_test_task",
    ]
)
