#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#


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

    identify_estimand_result = yield context.call_activity(
        "IdentifyEstimandActivity", data
    )

    cells = yield context.call_activity(
        "IdentifyEstimandNotebookCellsActivity", {**data}
    )

    notebook_result = yield context.call_activity(
        "AppendNotebookActivity", {"session_id": data["session_id"], "cells": cells}
    )

    return {**identify_estimand_result, **notebook_result}


main = df.Orchestrator.create(orchestrator_function)
