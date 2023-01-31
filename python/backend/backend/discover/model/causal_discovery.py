from enum import Enum
from typing import Any, Dict, List, Optional, Tuple, Union

from pydantic import BaseModel


class Constraints(BaseModel):
    causes: List[str]
    effects: List[str]
    forbiddenRelationships: List[Tuple[str, str]]
    potentialRelationships: Optional[List[Tuple[str, str]]] = None


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


class NormalizationOptions(BaseModel):
    with_mean: bool = True
    with_std: bool = True


class CausalDiscoveryPayload(BaseModel):
    dataset: Dataset
    normalization: NormalizationOptions = NormalizationOptions()
    constraints: Constraints
    causal_variables: List[CausalVariable]

    class Config:
        arbitrary_types_allowed = True


class NormalizedColumnMetadata(BaseModel):
    upper: float
    lower: float
    mean: float
    std: float


class DatasetStatistics(BaseModel):
    number_of_dropped_rows: int
    number_of_rows: int


class ATEDetails(BaseModel):
    reference: Optional[Union[float, str]] = None
    intervention: Optional[Union[float, str]] = None
    nature: Optional[CausalVariableNature] = None


_causal_var_nature_to_causica_var_type = {
    "Discrete": "continuous",  # TODO: make categorical
    "Continuous": "continuous",
    "Categorical Ordinal": "continuous",  # TODO: make categorical
    "Categorical Nominal": "continuous",  # TODO: make categorical
    "Binary": "binary",
    "Excluded": "continuous",
}


def map_to_causica_var_type(nature: CausalVariableNature):
    return _causal_var_nature_to_causica_var_type.get(nature, "continuous")
