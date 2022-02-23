#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json
import logging

import azure.durable_functions as df
import azure.functions as func


async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)

    request_data = req.get_json()
    logging.info(f"request data: {json.dumps(request_data)}")

    instance_id = await client.start_new("ExecuteNodeOrchestrator", None, request_data)

    logging.info(f"Started orchestration with ID = '{instance_id}'.")

    return client.create_check_status_response(req, instance_id)
