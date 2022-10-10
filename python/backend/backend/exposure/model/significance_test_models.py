#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dowhy import CausalModel
from dowhy.causal_estimator import CausalEstimate
from dowhy.causal_identifier import IdentifiedEstimand
from pydantic import BaseModel


class ComputeNullEffectSpec(BaseModel):
    estimate: CausalEstimate
    identified_estimand: IdentifiedEstimand
    causal_model: CausalModel
    original_effect: float

    class Config:
        arbitrary_types_allowed = True


class PropensityScoreSpec(BaseModel):
    estimate_id: str
    identified_estimand: IdentifiedEstimand
    causal_model: CausalModel
    estimate: CausalEstimate

    class Config:
        arbitrary_types_allowed = True


class SignificanceTestResult(BaseModel):
    p_value: str
    significance: bool

    def to_dict(self):
        return {"p_value": self.p_value, "significance": self.significance}
