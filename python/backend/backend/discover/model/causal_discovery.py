from typing import Any, Dict, List, Tuple, Union

import pandas as pd
from pydantic import BaseModel, Extra


class Constraints(BaseModel):
    causes: List[str]
    effects: List[str]
    forbiddenRelationships: List[Tuple[str, str]]


class Dataset(BaseModel):
    data: Dict[str, List[Any]]


class CausalDiscoveryPayload(BaseModel):
    # expected parameters
    dataset: Dataset
    constraints: Constraints

    # internal use only
    _prepared_data: Union[pd.DataFrame, None] = None

    class Config:
        arbitrary_types_allowed = True
        extra = Extra.allow
