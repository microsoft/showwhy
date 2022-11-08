from typing import Dict

from pydantic import BaseModel

InterventionResult = Dict[str, float]

InterventionValueByColumn = Dict[str, float]


class InterventionPayload(BaseModel):
    intervention_model_id: str
    interventions: InterventionValueByColumn
