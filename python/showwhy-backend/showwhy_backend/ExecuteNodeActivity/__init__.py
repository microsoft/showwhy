#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json
import logging
import traceback
import uuid

from os import extsep
from typing import Dict

import pandas as pd

from shared_code.data_processing import operations
from shared_code.io.storage import get_storage_client


storage = get_storage_client()


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

        execution_instance: operations.OperationNode = getattr(
            operations, node_data["type"]
        )(**node_data)
        result = execution_instance.execute_operation(step_context)
        cells = execution_instance.jupyter_cell_output()
        logging.info(step_context)
        logging.info(f"Completed node: {node_data['id']}")

        if body.get("write_context", False):
            storage.write_context(step_context)

        if isinstance(result, pd.DataFrame) or result != None:
            is_final = (
                "final" if not "partial" in body or not body["partial"] else "partial"
            )
            name = storage.write_output(
                session_id,
                node_data["result"],
                result,
                file_type=is_final,
                extension="csv",
            )

        try:
            json.dumps(result)
            return {
                "output_file": name
                if isinstance(result, pd.DataFrame) or result != None
                else None,
                "cells": cells,
                "result": result,
            }
        except:
            return {
                "output_file": name
                if isinstance(result, pd.DataFrame) or result != None
                else None,
                "cells": cells,
            }

    except Exception as ex:
        logging.error(f"Something went wrong, input: {body}", exc_info=True)
        storage.write_output(
            session_id,
            f"error_{task_id}",
            {"error": str(ex), "traceback": traceback.format_exc()},
            extension="json",
        )
        return {"output_file": None, "cells": None, "json_result": None}
