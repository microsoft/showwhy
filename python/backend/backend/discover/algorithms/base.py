from abc import ABC, abstractmethod
from typing import Dict

from backend.discover.base_payload import CausalDiscoveryPayload

CausalGraph = Dict[str, list]


class CausalDiscoveryRunner(ABC):
    def __init__(self, p: CausalDiscoveryPayload):
        self._prepared_data = p._prepared_data
        self._constraints = p.constraints

    @abstractmethod
    def do_causal_discovery(self) -> CausalGraph:
        pass
