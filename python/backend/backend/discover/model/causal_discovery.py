from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel


class Constraints(BaseModel):
    causes: List[str]
    effects: List[str]
    forbiddenRelationships: List[Tuple[str, str]]


class CausalVariableNature(str, Enum):
    Discrete = "Discrete"
    Continuous = "Continuous"
    CategoricalOrdinal = "Categorical Ordinal"
    CategoricalNominal = "Categorical Nominal"
    Binary = "Binary"
    Excluded = "Excluded"


class CausalVariable(BaseModel):
    name: str
    nature: Optional[CausalVariableNature] = None


class Dataset(BaseModel):
    data: Dict[str, List[Any]]


class CausalDiscoveryPayload(BaseModel):
    dataset: Dataset
    constraints: Constraints
    causal_variables: List[CausalVariable]

    class Config:
        arbitrary_types_allowed = True
