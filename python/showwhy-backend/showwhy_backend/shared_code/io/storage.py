import json
import logging
import os
import pickle
import tempfile

from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from io import StringIO
from typing import Any, Dict

import pandas as pd

from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas


class StorageClient(ABC):
    @abstractmethod
    def create_container(self) -> None:
        pass

    @abstractmethod
    def write_context(self, context: Dict, name: str = "metadata.pickle") -> None:
        pass

    @abstractmethod
    def read_context(self, session_id: str, name: str = "metadata.pickle") -> Dict:
        pass

    @abstractmethod
    def write_output(
        self,
        session_id: str,
        name: str,
        output: Any,
        file_type: str = "final",
        extension: str = None,
    ) -> None:
        pass

    @abstractmethod
    def read_output(self, session_id: str, name: str, file_type: str = "final") -> Dict:
        pass

    @abstractmethod
    def get_download_url(self, session_id: str, name: str) -> str:
        pass


class BlobStorageClient(StorageClient):
    def __init__(self, storage_connection_string, timeout=60 * 60):
        self.blob_service_client = BlobServiceClient.from_connection_string(
            storage_connection_string
        )
        self.timeout = timeout

    def create_container(self) -> None:
        try:
            self.blob_service_client.create_container(
                name="sessions", timeout=self.timeout
            )
        except:
            logging.info(f"Container [sessions] already exists")

    def write_context(self, context: Dict, name="metadata.pickle") -> None:

        try:
            data = pickle.dumps(context)

            blob_client = self.blob_service_client.get_blob_client(
                container="sessions", blob=os.path.join(context["session_id"], name)
            )
            # Create blob on storage
            # Overwrite if it already exists!
            blob_client.upload_blob(data, overwrite=True, timeout=self.timeout)
        except:
            logging.error("Failed to write pickle", exc_info=True)

    def read_context(self, session_id: str, name="metadata.pickle") -> Dict:
        try:
            # Create blob with same name as local file name
            blob_client = self.blob_service_client.get_blob_client(
                container="sessions", blob=os.path.join(session_id, name)
            )
            data = blob_client.download_blob(timeout=self.timeout).content_as_bytes()
            return pickle.loads(data)
        except:
            logging.error("Failed to load pickle", exc_info=True)
            return {"session_id": session_id}

    def write_output(
        self,
        session_id: str,
        name: str,
        output: Any,
        file_type: str = "final",
        extension: str = None,
    ):

        if isinstance(output, pd.DataFrame):
            data = output.to_csv(index=False)
            extension = extension if extension else "csv"
            name = f"{name}.{extension}"
        else:
            try:
                data = json.dumps(output)
                extension = extension if extension else "json"
                name = f"{name}.{extension}"
            except:
                data = pickle.dumps(output)
                extension = extension if extension else "pickle"
                name = f"{name}.pickle"

        blob_path = os.path.join(session_id, file_type, name)
        blob_client = self.blob_service_client.get_blob_client(
            container="sessions", blob=blob_path
        )
        blob_client.upload_blob(data, overwrite=True, timeout=self.timeout)
        return name

    def read_output(self, session_id: str, name: str, file_type: str = "final") -> Dict:
        blob_path = os.path.join(session_id, file_type, name)
        blob_client = self.blob_service_client.get_blob_client(
            container="sessions", blob=blob_path
        )
        data = blob_client.download_blob(timeout=self.timeout).content_as_bytes()
        if name.endswith("csv"):
            return pd.read_csv(StringIO(data.decode("utf-8")))
        elif name.endswith("json") or name.endswith("ipynb"):
            return json.loads(data)
        elif name.endswith("pickle"):
            return pickle.loads(data)
        return None

    def get_download_url(self, session_id: str, name: str) -> str:
        storage_connection_string = os.environ["CONTEXT_STORAGE_ACCOUNT_CONNECTION"]
        blob_path = f"{session_id}/final/{name}"

        account_key_index = 1 if "devstoreaccount1" in storage_connection_string else 2
        _, _, account_key = storage_connection_string.split(";")[
            account_key_index
        ].partition("=")

        start_time = datetime.utcnow()
        end_time = start_time + timedelta(hours=1)

        token = generate_blob_sas(
            self.blob_service_client.account_name,
            "sessions",
            blob_path,
            account_key=account_key,
            start=start_time,
            expiry=end_time,
            permission=BlobSasPermissions(read=True),
        )

        return (
            f"{self.blob_service_client.primary_endpoint}sessions/{blob_path}?{token}"
        )


class LocalStorageClient(StorageClient):
    def __init__(self):
        self.local_storage_location = os.path.join("..", "sessions")

    def create_container(self) -> None:
        # Create local dir
        try:
            os.makedirs(self.local_storage_location)
        except:
            logging.info(f"Folder [sessions] already exists")

        # Create Azurite storage container
        # Retrieve local storage connection to Azurite
        storage_connection_string = os.environ["AzureWebJobsStorage"]
        blob_service_client = BlobServiceClient.from_connection_string(
            storage_connection_string
        )

        # Create a container
        try:
            blob_service_client.create_container(name="sessions")
        except:
            logging.info(f"Container [sessions] already exists")

    def write_context(self, context: Dict, name="metadata.pickle") -> None:
        try:
            path = os.path.join(self.local_storage_location, context["session_id"])
            os.makedirs(path, exist_ok=True)
            with open(os.path.join(path, name), "wb") as context_file:
                pickle.dump(context, context_file)
        except:
            logging.error("Failed to write pickle", exc_info=True)

    def read_context(self, session_id: str, name="metadata.pickle") -> Dict:
        try:
            with open(
                os.path.join(self.local_storage_location, session_id, name), "rb"
            ) as context_file:
                return pickle.load(context_file)
        except:
            logging.error("Failed to load pickle", exc_info=True)
            return {"session_id": session_id}

    def write_output(
        self,
        session_id: str,
        name: str,
        output: Any,
        file_type: str = "final",
        extension: str = None,
    ):

        path = os.path.join(self.local_storage_location, session_id, file_type)
        os.makedirs(path, exist_ok=True)

        if extension == "csv" or isinstance(output, pd.DataFrame):
            extension = extension if extension else "csv"
            name = f"{name}.{extension}"
            file_path = os.path.join(path, name)
            output.to_csv(file_path, index=False)
        elif extension == "json" or extension == "ipynb":
            extension = extension if extension else "json"
            name = f"{name}.{extension}"
            file_path = os.path.join(path, name)
            with open(file_path, "w") as output_file:
                json.dump(output, output_file)
        else:
            extension = extension if extension else "pickle"
            name = f"{name}.pickle"
            file_path = os.path.join(path, name)
            with open(file_path, "wb") as output_file:
                pickle.dump(output, output_file)

        return name

    def read_output(self, session_id: str, name: str, file_type: str = "final") -> Dict:
        path = os.path.join(self.local_storage_location, session_id, file_type, name)

        if name.endswith("csv"):
            return pd.read_csv(path)
        elif name.endswith("json") or name.endswith("ipynb"):
            with open(path, "r") as output_file:
                return json.load(output_file)
        elif name.endswith("pickle"):
            with open(path, "rb") as output_file:
                return pickle.load(output_file)
        return None

    def get_download_url(self, session_id: str, name: str) -> str:
        # Build local file path
        local_path = os.path.abspath(
            f"{self.local_storage_location}/{session_id}/final/{name}"
        ).replace("\\", "/")

        # Retrieve local storage connection to Azurite
        storage_connection_string = os.environ["AzureWebJobsStorage"]
        blob_service_client = BlobServiceClient.from_connection_string(
            storage_connection_string
        )

        # Create a blob (container should already exist)
        blob_path = f"{session_id}/final/{name}"

        blob_client = blob_service_client.get_blob_client(
            container="sessions", blob=blob_path
        )

        with open(local_path, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)

        # Generate a SAS token (required even locally)
        account_key_index = 1 if "devstoreaccount1" in storage_connection_string else 2
        _, _, account_key = storage_connection_string.split(";")[
            account_key_index
        ].partition("=")

        start_time = datetime.utcnow()
        end_time = start_time + timedelta(hours=1)
        token = generate_blob_sas(
            blob_service_client.account_name,
            "sessions",
            blob_path,
            account_key=account_key,
            start=start_time,
            expiry=end_time,
            permission=BlobSasPermissions(read=True),
        )

        # Return azurite url (replace with localhost)
        return f'{blob_service_client.primary_endpoint.replace("azurite:10000", "localhost:81")}sessions/{blob_path}?{token}'


def get_storage_client():
    return (
        LocalStorageClient()
        if os.environ.get("LOCAL_EXECUTION", False)
        else BlobStorageClient(os.environ["CONTEXT_STORAGE_ACCOUNT_CONNECTION"])
    )
