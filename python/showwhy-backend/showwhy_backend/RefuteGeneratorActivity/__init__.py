#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import itertools

from typing import Dict, List

from showwhy_inference.inference_config import (
    DEFAULT_REFUTATION_TESTS,
    INCLUDE_SENSITIVITY_REFUTERS,
    SENSITIVITY_REFUTERS,
)


def main(body: Dict) -> str:
    num_simulations = body["refuter_specs"]["num_simulations"]
    inference_results = body["inference_results"]
    session_id = body["session_id"]
    execution_id = body["execution_id"]

    refuter_specs = create_refuter_specs(num_simulations)
    refuter_inputs = itertools.product(refuter_specs, inference_results, [session_id])
    refuter_inputs = [
        {
            "spec": refuter_input[0],
            "input_file": refuter_input[1]["output_file"],
            "task_id": refuter_input[1]["task_id"],
            "session_id": refuter_input[2],
            "execution_id": execution_id,
        }
        for refuter_input in refuter_inputs
    ]

    return refuter_inputs


def create_refuter_specs(num_simulations: int) -> List:
    """
    Helper function to create a list of refutation specs for the refutation tests
    """
    refuter_specs = []
    refutation_tests = (
        DEFAULT_REFUTATION_TESTS
        if not INCLUDE_SENSITIVITY_REFUTERS
        else DEFAULT_REFUTATION_TESTS + SENSITIVITY_REFUTERS
    )
    for test in refutation_tests:
        spec = {"method_name": test, "num_simulations": num_simulations}
        refuter_specs.append(spec)
    return refuter_specs
