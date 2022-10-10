#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import pandas as pd
from pydantic import BaseModel


class ShapInterpreterSpec(BaseModel):
    outcome_result: pd.DataFrame

    class Config:
        arbitrary_types_allowed = True


class ShapInterpreterResult(BaseModel):
    estimate_id: str
    shap_population_name: int
    shap_treatment: float
    shap_outcome: int
    shap_causal_model: float
    shap_estimator: float

    def to_dict(self):
        return {
            "estimate_id": self.estimate_id,
            "shap_population_name": self.shap_population_name,
            "shap_treatment": self.shap_treatment,
            "shap_outcome": self.shap_outcome,
            "shap_causal_model": self.shap_causal_model,
            "shap_estimator": self.shap_estimator,
        }


class ListShapInterpreterResult(BaseModel):
    results: List[ShapInterpreterResult]

    def to_dict(self):
        return [result.to_dict() for result in self.results]
