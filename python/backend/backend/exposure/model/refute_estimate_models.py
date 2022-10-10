#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from pydantic import BaseModel

from backend.exposure.model.estimate_effect_models import EstimateResult


class RefuterSpec(BaseModel):
    num_simulations: int
    method_name: str
    estimate: EstimateResult


class RefuterResult(BaseModel):
    estimate_id: str
    refuter: str
    result: int

    def to_dict(self):
        return {
            "estimate_id": self.estimate_id,
            "refuter": self.refuter,
            "result": self.result,
        }
