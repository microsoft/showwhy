#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

from pydantic import BaseModel

from backend.exposure.model.estimate_effect_models import EstimateResult


class RefuterSpec(BaseModel):
    num_simulations: int
    method_name: str
    estimate: EstimateResult


class RefuterResult(BaseModel):
    estimate_id: str
    refuter: str
    result: Optional[int] = None
    exc_info: Optional[str] = None

    def to_dict(self):
        default_info = {
            "estimate_id": self.estimate_id,
            "refuter": self.refuter,
            "result": self.result,
        }
        if self.exc_info is not None:
            return {
                **default_info,
                "exc_info": self.exc_info,
            }
        return default_info
