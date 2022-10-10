#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass


@dataclass
class FileNotFoundError(Exception):
    workspace_name: str
    file_path: str


@dataclass
class DataFrameNotLoadedError(Exception):
    workspace_name: str
    dataframe_name: str
