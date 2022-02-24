#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json
import uuid
from io import StringIO

import azure.functions as func
import pandas as pd
from shared_code.io.storage import get_storage_client

storage = get_storage_client()


def main(req: func.HttpRequest) -> func.HttpResponse:
    session_id = req.params.get('session_id')
    files = {}

    storage.create_container()

    for input_file in req.files.values():
        filename = input_file.filename
        contents = input_file.stream.read()

        name = storage.write_output(session_id, str(uuid.uuid4()), pd.read_csv(
            StringIO(contents.decode('utf-8'))), file_type='input', extension='csv')
        files[filename] = f'blob://{name}'

    return func.HttpResponse(
        body=json.dumps({
            'uploaded_files': files
        }),
        mimetype='application/json',
        status_code=200,
    )
