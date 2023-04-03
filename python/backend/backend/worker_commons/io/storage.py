#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import os
from abc import ABC, abstractmethod
from typing import Any, Dict
from uuid import uuid4

import pandas as pd

from backend.worker_commons import config
from backend.worker_commons.io.db import get_db_client
from backend.worker_commons.io.exceptions import FileNotFoundError


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


class NotebookLocalStorageClient(StorageClient):
    def __init__(self, storage_location):
        self.storage_location = storage_location

    def save(self, workspace_name: str, name: str, data: Any):
        final_path = os.path.join(self.storage_location, workspace_name)
        os.makedirs(final_path, exist_ok=True)
        with open(os.path.join(final_path, name), "wb") as binary_file:
            binary_file.write(data)

    def read(self, workspace_name: str, name: str) -> pd.DataFrame:
        try:
            # gets the uuid that represents the workspace name
            return pd.read_csv(os.path.join(self.storage_location, workspace_name, name))
        except:  # noqa: E722
            logging.error(f"File: {name} not found for workspace: {workspace_name}")
            raise FileNotFoundError(workspace_name, name)


class LocalStorageClient(StorageClient):
    def __init__(self, storage_location) -> None:
        self.storage_location = storage_location
        os.makedirs(self.storage_location, exist_ok=True)

    def _generate_workspace_id(self, workspace_name: str) -> str:
        workspace_id = str(uuid4())
        get_db_client().set_value(f"ws_upload_paths:{workspace_name}", workspace_id)
        return workspace_id

    def _get_workspace_id(self, workspace_name: str) -> str:
        return get_db_client().get_value(f"ws_upload_paths:{workspace_name}")

    def save(
        self,
        workspace_name: str,
        name: str,
        data: Any,
    ) -> None:
        # generate an uuid to represent the workspace name
        final_path = os.path.join(self.storage_location, self._generate_workspace_id(workspace_name))
        os.makedirs(final_path, exist_ok=True)
        with open(os.path.join(final_path, name), "wb") as binary_file:
            binary_file.write(data)

    def read(self, workspace_name: str, name: str) -> pd.DataFrame:
        try:
            # gets the uuid that represents the workspace name
            workspace_id = self._get_workspace_id(workspace_name)
            return pd.read_csv(os.path.join(self.storage_location, workspace_id, name))
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
