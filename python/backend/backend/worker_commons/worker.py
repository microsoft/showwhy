from celery import Celery

from backend.worker_commons import config

backend_worker = Celery(
    "app", backend=config.get_redis_url(), broker=config.get_redis_url()
)
backend_worker.conf.task_serializer = "pickle"
backend_worker.conf.result_serializer = "pickle"
backend_worker.conf.accept_content = [
    "application/json",
    "application/x-python-serialize",
]
backend_worker.autodiscover_tasks(
    [
        # exposure tasks
        "backend.exposure.worker.identify_estimand_task",
        "backend.exposure.worker.estimate_effect_task",
        "backend.exposure.worker.refute_estimate_task",
        "backend.exposure.worker.confidence_interval_task",
        "backend.exposure.worker.shap_interpreter_task",
        "backend.exposure.worker.significance_test_task",
        # discover tasks
        "backend.discover.worker.causal_discovery_task",
    ]
)
