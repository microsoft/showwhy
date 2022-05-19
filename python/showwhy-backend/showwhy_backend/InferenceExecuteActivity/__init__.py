#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import traceback
import uuid

from typing import Dict

import pandas as pd

from showwhy_inference.inference import estimate_specification

from shared_code.io.db import get_db_client
from shared_code.io.storage import get_storage_client


storage = get_storage_client()
db = get_db_client()


def main(body: Dict):
    try:
        logging.info(f"Input to activity: {body}")
        node_data = body["node_data"]
        session_id = body["session_id"]
        task_id = body.get("task_id", str(uuid.uuid4()))
        logging.info(f"node_data: {node_data}")
        logging.info(f"session_id: {session_id}")
        logging.info(f"task_id: {task_id}")

        step_context = storage.read_context(session_id)
        result = estimate_specification(node_data["spec"], step_context)

        logging.info(step_context)
        logging.info(f"Completed node: {node_data['id']}")

        result_json = {
            **result,
            "execution_id": body.get("execution_id"),
            "task_id": f"{task_id}",
            "estimated_effect": result["estimated_effect"][2].value
            if result["estimated_effect"][2]
            else None,
        }

        if result["estimated_effect"] is None:
            for refuter in node_data["refuter_specs"]:
                result_json[
                    f'refuter_{refuter["method_name"].replace("_refuter", "")}'
                ] = None

        db.insert_record(result_json)
        name = storage.write_output(
            session_id, task_id, result, file_type="partial", extension="pickle"
        )

        return {"output_file": name, "task_id": task_id}

    except Exception as ex:
        logging.error(f"Something went wrong, input: {body}", exc_info=True)
        storage.write_output(
            session_id,
            f"error_{task_id}",
            {"error": str(ex), "traceback": traceback.format_exc()},
            extension="json",
        )
        db.insert_record(
            {
                **body,
                "execution_id": body.get("execution_id"),
                "task_id": f"{task_id}",
                "state": "failed",
                "error": str(ex),
                "traceback": traceback.format_exc(),
            }
        )
        raise ex
