from typing import Dict, Optional

from pydantic import BaseModel

InterventionValueByColumn = Dict[str, float]


class InterventionResult(BaseModel):
    baseline: InterventionValueByColumn
    intervention: InterventionValueByColumn


class InterventionPayload(BaseModel):
    intervention_model_id: str
    interventions: InterventionValueByColumn
    confidence_threshold: Optional[float] = None
    weight_threshold: Optional[float] = None
