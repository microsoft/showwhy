#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json
import logging

import azure.functions as func

from shared_code.io.storage import get_storage_client


storage = get_storage_client()


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    session_id = req.params.get("session_id")
    file_name = req.params.get("file_name")

    storage.create_container()

    url = storage.get_download_url(session_id, file_name)

    return func.HttpResponse(body=json.dumps({"signed_url": url}))
