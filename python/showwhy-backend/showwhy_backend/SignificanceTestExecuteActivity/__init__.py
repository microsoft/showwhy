#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import traceback
import uuid

from typing import Dict

from showwhy_inference.significance_test import compute_null_effect

from shared_code.io.db import get_db_client
from shared_code.io.storage import get_storage_client


storage = get_storage_client()
db = get_db_client()


def main(body: Dict):
    try:
        logging.info(f"SIGNIFICANCE TEST: Input to activity: {body}")
        node_data = body["node_data"]
        session_id = body["session_id"]
        task_id = body.get("task_id", str(uuid.uuid4()))
        logging.info(f"SIGNIFICANCE TEST: node_data: {node_data}")
        logging.info(f"SIGNIFICANCE TEST: session_id: {session_id}")
        logging.info(f"SIGNIFICANCE TEST: task_id: {task_id}")

        context = storage.read_context(session_id)
        result = compute_null_effect(context["original_inference_results"])
        result = {"median_null_effect": result}
        logging.info(f"SIGNIFICANCE TEST: Completed node: {node_data['id']}")

        result = {
            **result,
            "execution_id": body.get("execution_id"),
            "task_id": f"{task_id}",
        }
        db.insert_record(result)
        result.pop("_id", None)
        return result

    except Exception as ex:
        logging.error(
            f"SIGNIFICANCE TEST: Something went wrong, input: {body}", exc_info=True
        )
        db.insert_record(
            {
                **body,
                "execution_id": body.get("execution_id"),
                "task_id": f"{task_id}",
                "state": "failed",
                "median_null_effect": None,
                "error": str(ex),
                "traceback": traceback.format_exc(),
            }
        )
        raise ex
