import logging

from backend.discover.algorithms.interventions.deci import DeciInterventionModel
from backend.discover.model.interventions import InterventionPayload, InterventionResult
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def deci_intervention_task(payload: InterventionPayload) -> InterventionResult:
    logging.info(f"Running intervention with id {payload.intervention_model_id}.")

    model: DeciInterventionModel = DeciInterventionModel.load(
        payload.intervention_model_id
    )

    return model.perform_intervention(payload.interventions)
