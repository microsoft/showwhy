import logging
from abc import ABC, abstractmethod
from typing import Callable, Dict, Optional

import networkx
import pandas as pd
from networkx.readwrite import json_graph
from sklearn.preprocessing import StandardScaler

from backend.discover.model.causal_discovery import (
    CausalDiscoveryPayload,
    CausalVariableNature,
    DatasetStatistics,
    NormalizedColumnMetadata,
)

CausalGraph = Dict[str, list]

ProgressCallback = Optional[Callable[[float], None]]


class CausalDiscoveryRunner(ABC):
    def __init__(self, p: CausalDiscoveryPayload, progress_callback: ProgressCallback = None):
        self._dataset_data = p.dataset.data
        self._normalization = p.normalization
        self._constraints = p.constraints
        self._progress_callback = progress_callback
        self._nature_by_variable = {v.name: v.nature for v in p.causal_variables}
        self._normalized_columns_metadata = dict()
        self._number_of_rows = 0
        self._number_of_dropped_rows = 0

    def register_progress_callback(self, progress_callback: ProgressCallback = None) -> None:
        self._progress_callback = progress_callback

    def _report_progress(self, percentage: float) -> None:
        if self._progress_callback:
            self._progress_callback(percentage)

    def _get_empty_graph_json(self, pandas_data: pd.DataFrame):
        graph = networkx.Graph()
        graph.add_nodes_from(pandas_data.columns)
        return json_graph.cytoscape_data(graph)

    def _has_column_nature(self, column: str, nature: CausalVariableNature) -> bool:
        column_nature = self._nature_by_variable[column]
        return column_nature and column_nature == nature

    def _normalize_continuous_columns(self):
        if self._prepared_data.size != 0:
            continuous_columns = [
                c for c in self._prepared_data.columns if self._has_column_nature(c, CausalVariableNature.Continuous)
            ]

            if continuous_columns:
                if self._normalization.with_mean or self._normalization.with_std:
                    logging.info(
                        f"Scaling continuous columns {continuous_columns} using mean={self._normalization.with_mean} and standard deviation={self._normalization.with_std}"
                    )
                    self._prepared_data[continuous_columns] = StandardScaler(
                        with_mean=self._normalization.with_mean,
                        with_std=self._normalization.with_std,
                    ).fit_transform(self._prepared_data[continuous_columns])

                self._normalized_columns_metadata = {
                    column: NormalizedColumnMetadata(
                        upper=self._prepared_data[column].max(),
                        lower=self._prepared_data[column].min(),
                        mean=self._prepared_data[column].mean(),
                        std=self._prepared_data[column].std(),
                    )
                    for column in continuous_columns
                }

    def _remove_rows_with_missing_values(self):
        self._number_of_rows = self._prepared_data.shape[0]
        self._prepared_data.dropna(inplace=True)
        self._number_of_dropped_rows = self._number_of_rows - self._prepared_data.shape[0]

    def _encode_categorical_as_integers(self):
        for name in self._prepared_data.columns:
            if self._nature_by_variable[name] == CausalVariableNature.CategoricalNominal:
                logging.info(f"encoding categorical nominal column {name} to integers")
                self._prepared_data[name] = pd.factorize(self._prepared_data[name])[0]

    def _prepare_data(self):
        self._prepared_data = pd.DataFrame.from_dict(self._dataset_data)
        self._remove_rows_with_missing_values()
        self._normalize_continuous_columns()

    def _attach_common_attributes_to_result(self, result: CausalGraph):
        result["normalized_columns_metadata"] = self._normalized_columns_metadata
        result["dataset_statistics"] = DatasetStatistics(
            number_of_dropped_rows=self._number_of_dropped_rows,
            number_of_rows=self._number_of_rows,
        )

    @abstractmethod
    def do_causal_discovery(self) -> CausalGraph:
        pass

    def run(self) -> CausalGraph:
        self._prepare_data()

        if self._prepared_data.size == 0:
            result = self._get_empty_graph_json(self._prepared_data)
        else:
            result = self.do_causal_discovery()

        self._attach_common_attributes_to_result(result)

        return result
