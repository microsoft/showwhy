from typing import Any, Dict, List, Tuple

from pydantic import BaseModel


class Constraints(BaseModel):
    causes: List[str]
    effects: List[str]
    forbiddenRelationships: List[Tuple[str, str]]


class Dataset(BaseModel):
    data: Dict[str, List[Any]]


class CausalDiscoveryPayload(BaseModel):
    dataset: Dataset
    constraints: Constraints

    class Config:
        arbitrary_types_allowed = True
