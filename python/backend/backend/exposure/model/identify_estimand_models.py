#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from dowhy import CausalModel
from pydantic import BaseModel


class IdentifyEstimandResult(BaseModel):
    estimate_possibility: bool
    backdoor_variables: List[str]
    frontdoor_variables: List[str]
    instrumental_variables: List[str]
    causal_model: CausalModel

    def to_dict(self):
        return {
            "estimate_possibility": self.estimate_possibility,
            "backdoor_variables": self.backdoor_variables,
            "frontdoor_variables": self.frontdoor_variables,
            "instrumental_variables": self.instrumental_variables,
        }

    class Config:
        arbitrary_types_allowed = True
