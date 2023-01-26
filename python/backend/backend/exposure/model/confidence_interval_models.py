#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

from pydantic import BaseModel

from backend.exposure.model.estimate_effect_models import EstimateResult


class ConfidenceIntervalParams(BaseModel):
    estimate: EstimateResult


class ConfidenceIntervalResult(BaseModel):
    estimate_id: str
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    exc_info: Optional[str] = None

    def to_dict(self):
        default_info = {
            "estimate_id": self.estimate_id,
            "lower_bound": self.lower_bound,
            "upper_bound": self.upper_bound,
        }
        if self.exc_info is not None:
            return {
                **default_info,
                "exc_info": self.exc_info,
            }
        return default_info
