#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import Dict

import azure.durable_functions as df

from shared_code.exception.invalid_request import InvalidRequestException


def __validate_request(data: Dict):
    if "session_id" not in data or "node_data" not in data:
        raise InvalidRequestException(
            "Parameters 'session_id' and 'node_data' must be present in the request body"
        )


def orchestrator_function(context: df.DurableOrchestrationContext):
    data = context.get_input()

    try:
        __validate_request(data)
    except InvalidRequestException as invalid_request:
        return {"error": str(invalid_request)}
    logging.info(f"Executing DataProcessingOrchestrator with input: [{data}]")

    node_data = data["node_data"]

    body = {
        "write_context": True,
        "node_data": node_data,
        "session_id": data["session_id"],
    }
    result = yield context.call_activity("ExecuteNodeActivity", body)

    notebook_output = yield context.call_activity(
        "AppendNotebookActivity",
        {"session_id": data["session_id"], "cells": result["cells"]},
    )

    response = {"output_file": result["output_file"], **notebook_output}

    if "result" in result:
        response["result"] = result["result"]

    return response


main = df.Orchestrator.create(orchestrator_function)
