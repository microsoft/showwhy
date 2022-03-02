#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#


import uuid

from typing import Dict

from showwhy_inference.inference import join_results

from shared_code.io.storage import get_storage_client


storage = get_storage_client()


def main(body: Dict):
    session_id = body["session_id"]
    context = storage.read_context(session_id)
    result_name = body["result"]
    results = body["results"]

    results_df = join_results(results)

    file_name = storage.write_output(
        session_id, str(uuid.uuid4()), results_df, file_type="partial", extension="csv"
    )

    context[result_name] = results_df
    storage.write_context(context)

    return {"output": file_name}
