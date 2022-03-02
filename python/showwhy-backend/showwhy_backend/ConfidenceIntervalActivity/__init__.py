#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import Dict

from showwhy_inference.confidence_interval import ConfidenceInterval

from shared_code.io.db import get_db_client
from shared_code.io.storage import get_storage_client


storage = get_storage_client()
db = get_db_client()

storage = get_storage_client()


def main(body: Dict) -> str:
    input_file = body["input_file"]
    session_id = body["session_id"]
    execution_id = body["execution_id"]
    task_id = body["task_id"]

    logging.info(f"Computing confidence intervals for session: [{session_id}]")

    additional_inputs = storage.read_output(session_id, input_file, file_type="partial")

    estimated_effect = additional_inputs["estimated_effect"]

    if estimated_effect:
        _, _, estimate = estimated_effect
        confidence_interval_result = ConfidenceInterval().estimate_confidence_intervals(
            estimate
        )

        result = {
            **additional_inputs,
            **confidence_interval_result,
            "task_id": task_id,
            "estimated_effect": estimate.value if estimate else None,
        }

        db.insert_record(
            {
                **confidence_interval_result,
                "execution_id": execution_id,
                "task_id": f"{task_id}",
            }
        )

        return result
    else:
        return {}
