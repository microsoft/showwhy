#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import os
from abc import ABC, abstractmethod
from typing import Any, Dict

import pandas as pd

from backend.exposure import config
from backend.exposure.model.exceptions import FileNotFoundError


class StorageClient(ABC):
    @abstractmethod
    def save(
        self,
        workspace_name: str,
        name: str,
        data: Any,
    ) -> None:
        pass

    @abstractmethod
    def read(self, workspace_name: str, name: str) -> Dict:
        pass


class LocalStorageClient(StorageClient):
    def __init__(self, storage_location) -> None:
        self.storage_location = storage_location
        os.makedirs(self.storage_location, exist_ok=True)

    def save(
        self,
        workspace_name: str,
        name: str,
        data: Any,
    ) -> None:
        final_path = os.path.join(self.storage_location, workspace_name)
        os.makedirs(final_path, exist_ok=True)
        with open(os.path.join(final_path, name), "wb") as binary_file:
            binary_file.write(data)

    def read(self, workspace_name: str, name: str) -> pd.DataFrame:
        try:
            return pd.read_csv(
                os.path.join(self.storage_location, workspace_name, name)
            )
        except:  # noqa: E722
            logging.error(f"File: {name} not found for workspace: {workspace_name}")
            raise FileNotFoundError(workspace_name, name)


def get_storage_client(preferred_storage=None):
    if preferred_storage is None:
        storage_location = config.get_storage_url()
        if storage_location.startswith("/"):
            return LocalStorageClient(storage_location)
    else:
        return preferred_storage
