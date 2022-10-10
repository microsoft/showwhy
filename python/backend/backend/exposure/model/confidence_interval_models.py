#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from pydantic import BaseModel

from backend.exposure.model.estimate_effect_models import EstimateResult


class ConfidenceIntervalParams(BaseModel):
    estimate: EstimateResult


class ConfidenceIntervalResult(BaseModel):
    estimate_id: str
    lower_bound: float
    upper_bound: float

    def to_dict(self):
        return {
            "estimate_id": self.estimate_id,
            "lower_bound": self.lower_bound,
            "upper_bound": self.upper_bound,
        }
