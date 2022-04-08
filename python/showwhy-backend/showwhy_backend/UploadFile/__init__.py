#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import base64
import json
import logging
import os
import tempfile
import uuid
import zipfile

from io import StringIO

import azure.functions as func
import pandas as pd

from shared_code.io.storage import get_storage_client


storage = get_storage_client()


def main(req: func.HttpRequest) -> func.HttpResponse:
    session_id = req.params.get("session_id")
    files = {}

    storage.create_container()

    data = req.get_body()
    logging.info(f"Raw data content: [{data}]")
    data = (
        str(data)
        .split("base64,")[1]
        .split("-")[0]
        .replace("'", "")
        .replace("\\r\\n", "")
    )
    logging.info(f"base64 data from content: [{data}]")
    file_path = os.path.join(tempfile.gettempdir(), f"{str(uuid.uuid4())}.zip")
    with open(file_path, "wb") as file:
        file.write(base64.b64decode(data))
    with zipfile.ZipFile(file_path, "r") as file:
        for data_file in file.namelist():
            with file.open(data_file, "r") as data:
                file_path = __write_to_context(data.read(), session_id)
                files[data_file] = file_path

    return func.HttpResponse(
        body=json.dumps({"uploaded_files": files}),
        mimetype="application/json",
        status_code=200,
    )


def __write_to_context(content: bytes, session_id: str) -> str:
    name = storage.write_output(
        session_id,
        str(uuid.uuid4()),
        pd.read_csv(StringIO(content.decode("utf-8"))),
        file_type="input",
        extension="csv",
    )
    return f"blob://{name}"
