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