#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#


from typing import Dict


def main(body: Dict) -> str:
    inference_results = body["inference_results"]
    session_id = body["session_id"]
    execution_id = body["execution_id"]

    confidence_interval_inputs = [
        {
            "input_file": body["output_file"],
            "task_id": body["task_id"],
            "session_id": session_id,
            "execution_id": execution_id,
        }
        for body in inference_results
    ]

    return confidence_interval_inputs
