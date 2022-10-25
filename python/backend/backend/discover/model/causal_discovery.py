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


class NormalizedColumnMetadata(BaseModel):
    upper: float
    lower: float
    mean: float
    std: float


_causal_var_nature_to_causica_var_type = {
    "Discrete": "continuous",  # TODO: make categorical (related to ONNX)
    "Continuous": "continuous",
    "Categorical Ordinal": "continuous",  # TODO: make categorical (related to ONNX)
    "Categorical Nominal": "continuous",  # TODO: make categorical (related to ONNX)
    "Binary": "binary",
    "Excluded": "continuous",
}


def map_to_causica_var_type(nature: CausalVariableNature):
    return _causal_var_nature_to_causica_var_type.get(nature, "continuous")
