from abc import ABC, abstractmethod
from typing import Callable, Dict, Optional

from backend.discover.model.causal_discovery import CausalDiscoveryPayload

CausalGraph = Dict[str, list]

ProgressCallback = Optional[Callable[[float], None]]


class CausalDiscoveryRunner(ABC):
    def __init__(
        self, p: CausalDiscoveryPayload, progress_callback: ProgressCallback = None
    ):
        self._prepared_data = p._prepared_data
        self._constraints = p.constraints
        self._progress_callback = progress_callback

    def register_progress_callback(
        self, progress_callback: ProgressCallback = None
    ) -> None:
        self._progress_callback = progress_callback

    def _report_progress(self, percentage: float) -> None:
        if self._progress_callback:
            self._progress_callback(percentage)

    @abstractmethod
    def do_causal_discovery(self) -> CausalGraph:
        pass
