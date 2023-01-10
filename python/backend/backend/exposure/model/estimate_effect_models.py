#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Any, Dict, List, Optional

import pandas as pd
from dowhy import CausalModel
from dowhy.causal_estimator import CausalEstimate
from dowhy.causal_identifier import IdentifiedEstimand
from pydantic import BaseModel


class PopulationSpec(BaseModel):
    type: str
    label: str
    dataframe: str
    variable: Optional[str] = None


class PopulationSpecDataFrame(PopulationSpec):
    dataframe: pd.DataFrame

    class Config:
        arbitrary_types_allowed = True


class TreatmentSpec(BaseModel):
    type: str
    label: str
    variable: str


class OutcomeSpec(BaseModel):
    type: str
    label: str
    variable: str


class ModelSpec(BaseModel):
    type: str
    label: str
    confounders: List[str]
    effect_modifiers: List[str]


class CausalGraphModelSpec(ModelSpec):
    treatment: str
    outcome: str
    causal_graph: str


class EstimatorSpec(BaseModel):
    type: str
    label: str
    require_propensity_score: bool
    method_name: str
    method_params: Optional[Dict[str, Any]]


class Specification(BaseModel):
    population: PopulationSpecDataFrame
    treatment: TreatmentSpec
    outcome: OutcomeSpec
    model: CausalGraphModelSpec
    estimator: EstimatorSpec

    def is_valid(self) -> bool:
        if self.treatment.variable != self.model.treatment:
            return False
        if self.outcome.variable != self.model.outcome:
            return False
        if self.estimator.require_propensity_score and not self.model.confounders and not self.model.effect_modifiers:
            return False
        return True


class EstimateEffectRequestBody(BaseModel):
    population_specs: List[PopulationSpec]
    treatment_specs: List[TreatmentSpec]
    outcome_specs: List[OutcomeSpec]
    model_specs: List[ModelSpec]
    estimator_specs: List[EstimatorSpec]


class EstimateResult(BaseModel):
    id: str
    population_type: str
    population_name: str
    population_size: int
    treatment_type: str
    treatment: str
    outcome_type: str
    outcome: str
    causal_model: str
    estimator: str
    causal_model_graph: CausalModel
    identified_estimand: IdentifiedEstimand
    estimate: CausalEstimate
    covariate_balance: Optional[Dict[str, Any]] = None

    def to_dict(self):
        return {
            "id": self.id,
            "population_type": self.population_type,
            "population_name": self.population_name,
            "population_size": self.population_size,
            "treatment_type": self.treatment_type,
            "treatment": self.treatment,
            "outcome_type": self.outcome_type,
            "outcome": self.outcome,
            "causal_model": self.causal_model,
            "estimator": self.estimator,
            "estimated_effect": self.estimate.value,
            "covariate_balance": self.covariate_balance,
        }

    class Config:
        arbitrary_types_allowed = True
