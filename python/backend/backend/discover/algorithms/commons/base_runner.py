import logging
from abc import ABC, abstractmethod
from typing import Any, Callable, Dict, List, Optional, Tuple

import networkx
import numpy as np
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

    def _get_column_names(self) -> list[str]:
        return [self._prepared_data.columns[i] for i in range(len(self._prepared_data.columns))]

    def _get_labels_map(self) -> dict[int, str]:
        return {i: self._prepared_data.columns[i] for i in range(len(self._prepared_data.columns))}

    def _get_name_to_index(self) -> dict[int, str]:
        return {self._prepared_data.columns[i]: i for i in range(len(self._prepared_data.columns))}

    def _build_causal_graph(
        self,
        labeled_graph: Any,
        has_weights: bool,
        has_confidence_values: bool,
        **kwargs,
    ) -> CausalGraph:
        causal_graph = json_graph.cytoscape_data(labeled_graph)

        causal_graph["has_weights"] = has_weights
        causal_graph["has_confidence_values"] = has_confidence_values

        for key, value in kwargs.items():
            causal_graph[key] = value

        return causal_graph

    def _build_constraint_matrix(
        self,
        name_to_idx: dict[str, int],
        tabu_child_nodes: Optional[List[str]] = None,
        tabu_parent_nodes: Optional[List[str]] = None,
        tabu_edges: Optional[List[Tuple[str, str]]] = None,
        edge_hints: Optional[List[Tuple[str, str]]] = None,
    ) -> np.ndarray:
        """
        Makes constraint matrix.

        Arguments:
            tabu_child_nodes: Optional[List[str]]
                nodes that cannot be children of any other nodes (root nodes)
            tabu_parent_nodes: Optional[List[str]]
                edges that cannot be the parent of any other node (leaf nodes)
            tabu_edge: Optional[List[Tuple[str, str]]]
                edges that cannot exist
            edge_hints: Optional[List[Tuple[str, str]]]
                edges we want to exist (not mandatory thought)

        Returns:
            np.ndarray:
                A matrix where, 0 means the edge should not exist, 1 means the edge should exist and
                -1 means the edge must be discovered.
        """
        constraint = np.full((len(self._prepared_data.columns), len(self._prepared_data.columns)), -1)

        if tabu_child_nodes is not None:
            for node in tabu_child_nodes:
                idx = name_to_idx[node]
                # these are the causes, so they are not allowed to have
                # incoming edges
                constraint[:, idx] = 0

        if tabu_parent_nodes is not None:
            for node in tabu_parent_nodes:
                idx = name_to_idx[node]
                # these are the effects, so they are not allowed to have
                # outgoing edges
                constraint[idx, :] = 0

        if tabu_edges is not None:
            for source, target in tabu_edges:
                source_idx, target_idx = name_to_idx[source], name_to_idx[target]
                constraint[source_idx, target_idx] = 0

        if edge_hints is not None:
            for source, target in edge_hints:
                source_idx, target_idx = name_to_idx[source], name_to_idx[target]
                constraint[source_idx, target_idx] = 1

        # self edges should not be allowed
        for i in range(len(self._prepared_data.columns)):
            constraint[i][i] = -1

        return constraint

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
