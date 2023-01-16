import logging
from typing import Type

import celery.states as states

from backend.discover.algorithms.commons.base_runner import CausalDiscoveryRunner, CausalGraph
from backend.discover.model.causal_discovery import CausalDiscoveryPayload
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def causal_discovery_task(runner_cls: Type[CausalDiscoveryRunner], payload: CausalDiscoveryPayload) -> CausalGraph:
    logging.info(f"Running {runner_cls.name} Causal Discovery.")
    runner = runner_cls(
        payload,
        lambda progress: causal_discovery_task.update_state(state=states.STARTED, meta={"progress": progress}),
    )
    return runner.run()
