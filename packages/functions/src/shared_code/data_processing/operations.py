#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
from abc import abstractmethod
from typing import Dict, List
from urllib.parse import urlparse

import re
import pandas as pd
from shared_code.data_processing.aggregate_parser import DataAggregationParser
from shared_code.data_processing.filter_parser import JsonLogicParser
from shared_code.io.storage import get_storage_client
from shared_code.io.notebook import new_code_cell, new_markdown_cell

storage = get_storage_client()


class OperationNode:
    @abstractmethod
    def jupyter_cell_output(self) -> List[str]:
        pass

    @abstractmethod
    def execute_operation(self, context: Dict) -> pd.DataFrame:
        pass


class LoadNode(OperationNode):

    def __init__(self, url: str, result: str, file_type: str = "csv",
                 compression: str = None, separator: str = ",", **kwargs):
        self.url = url
        self.result = result
        self.file_type = file_type
        self.compression = compression
        self.separator = separator

    def jupyter_cell_output(self) -> List[str]:
        compression_param = f"'{self.compression}'" if self.compression else None
        dataframe_name = re.sub(r'\W+', '_', self.result)
        return [
            new_markdown_cell(["# Load Data"]),
            new_code_cell([
                f"{dataframe_name} = pd.read_{self.file_type}('./{self.result}.csv', sep='{self.separator}', compression={compression_param})",
                f"{dataframe_name}.head()"
            ])
        ]

    def execute_operation(self, context: Dict) -> None:
        url = urlparse(self.url)
        if self.file_type == 'csv':

            if url.scheme == 'blob':
                context[self.result] = storage.read_output(
                    context['session_id'], url.netloc, file_type='input')
            else:
                context[self.result] = pd.read_csv(
                    self.url, sep=self.separator, compression=self.compression)
                logging.info(f"context: {context}")
            return context[self.result]


class JoinNode(OperationNode):

    def __init__(self, left: str, right: str, on: str, how: str, result: str, **kwargs):
        self.left = left
        self.right = right
        self.how = how
        self.on = [column.strip() for column in on.split(',')]
        self.result = result

    def jupyter_cell_output(self) -> List[str]:
        on_cell = [f"'{column}'" for column in self.on]
        return [
            new_code_cell([
                f"{self.result} = {self.left}.merge({self.right}, on=[{','.join(on_cell)}], how={self.how})",
                f"{self.result}.head()"
            ])
        ]

    def execute_operation(self, context: Dict) -> None:
        context[self.result] = context[self.left].merge(
            context[self.right], on=self.on, how=self.how)
        return context[self.result]


class FilterNode(OperationNode):

    def __init__(self, dataframe: str, filter_expression: Dict, result: str, **kwargs):
        self.dataframe = dataframe
        self.query_expression = JsonLogicParser().parse_filter(filter_expression)
        self.result = result

    def jupyter_cell_output(self) -> List[str]:
        return [
            new_code_cell([
                f"{self.result} = {self.dataframe}.query(\"{self.query_expression}\")",
                f"{self.result}.head()"
            ])
        ]

    def execute_operation(self, context: Dict) -> None:
        context[self.result] = context[self.dataframe].query(
            self.query_expression)
        return context[self.result]


class DropColumnsNode(OperationNode):

    def __init__(self, dataframe: str, columns: str, result: str, **kwargs):
        self.dataframe = dataframe
        self.columns = [column.strip() for column in columns.split(',')]
        self.result = result

    def jupyter_cell_output(self) -> List[str]:
        drop_columns_cell = [f'"{column}"' for column in self.columns]
        return [
            new_code_cell([
                f"{self.result} = {self.dataframe}.drop([{', '.join(drop_columns_cell)}], axis=1)",
                f"{self.result}.head()"
            ])
        ]

    def execute_operation(self, context: Dict) -> None:
        context[self.result] = context[self.dataframe].drop(
            self.columns, axis=1)
        return context[self.result]


class AggregateNode(OperationNode):
    def __init__(self, dataframe: str, index_column: str, agg_expressions: List, on_dataframe: bool, result: str, **kwargs):
        """
        :param dataframe: name of the dataframe to operate on
        :param index_column: name of the identifier column to group by
        :param agg_expression: list of aggregation operations
        :param on_dataframe: true if we want to apply the agg operations on the whole dataframe rather applying onto specific columns
        :param result: key to store pandas excution result in the context dict
        """
        self.dataframe = dataframe
        self.index_column = index_column
        self.agg_expressions = agg_expressions
        self.on_dataframe = on_dataframe
        self.result = result
        self.agg_parser = DataAggregationParser()

    def jupyter_cell_output(self) -> List[str]:
        if self.on_dataframe:
            return [
                new_code_cell([
                    f"{self.result} = {self.dataframe}.groupby('{self.index_column}').agg([{', '.join(self.agg_expressions)}]).reset_index()",
                    f"{self.result}.head()"
                ])
            ]
        else:
            agg_operations = self.agg_parser.parse_aggregate_list(
                self.agg_expressions)
            return [
                new_code_cell([
                    f"{self.result} = {self.dataframe}.groupby('{self.index_column}').apply(lambda x: pd.Series({agg_operations})).reset_index()"
                    f"{self.result}.head()"
                ])
            ]

    def execute_operation(self, context: Dict) -> None:
        if self.on_dataframe:
            # context[self.result] = context[self.dataframe].groupby(
            #     self.index_column).agg(self.agg_operations).reset_index()
            pass
        else:
            context[self.result] = context[self.dataframe].groupby(self.index_column)\
                .apply(lambda x: self.agg_parser.execute_aggregate_list(x, self.agg_expressions)).reset_index()
        return context[self.result]
