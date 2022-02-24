#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import logging
import time
from typing import Dict
import azure.durable_functions as df
from shared_code.exception.invalid_request import InvalidRequestException
from shared_code.inference.inference_config import get_batch_size, get_batch

SIGNIFICANCE_BATCH_SIZE = get_batch_size('SIGNIFICANCE_BATCH_SIZE')


def __validate_request(data: Dict):
    if 'session_id' not in data or 'node_data' not in data:
        raise InvalidRequestException(
            "Parameters 'session_id' and 'node_data' must be present in the request body")


def orchestrator_function(context: df.DurableOrchestrationContext):
    data = {
        **context.get_input(),
        'execution_id': context.parent_instance_id
    }
    try:
        __validate_request(data)
    except InvalidRequestException as invalid_request:
        return {
            'error': str(invalid_request)
        }
    logging.info(
        f'Executing SignificanceTestOrchestrator with input: [{data}]')

    context.set_custom_status({
        'step': 'Calculating effects under the null hypothesis'
    })

    # Estimate effects on null distribution
    significance_test_inputs = yield context.call_activity("SignificanceTestGeneratorActivity", data)
    significance_test_results = []
    for size, current, batch in get_batch(significance_test_inputs, SIGNIFICANCE_BATCH_SIZE):
        tasks = [context.call_activity("SignificanceTestExecuteActivity", task_inputs)
                 for task_inputs in batch]
        partial_results = yield context.task_all(tasks)
        significance_test_results.extend(partial_results)
        logging.info(f"SIGNIFICANCE TEST: {current} of {size} completed")
        logging.info("Sleeping for 1 second...")
        time.sleep(1)
    logging.info("Estimate effects on null distribution completed")
    significance_test_results = [
        result for result in significance_test_results if result['median_null_effect']]
    logging.info(
        f"Significance Test: Number of valid simulations : {len(significance_test_results)}")

    # calculate p-value
    final_result = yield context.call_activity("SignificanceTestFinalResultActivity", {
        'session_id': data['session_id'],
        'execution_id': data['execution_id'],
        'result': data['node_data']['result'],
        'null_effect_results': significance_test_results
    })

    context.set_custom_status({
        'step': 'Significance Test Completed'
    })

    logging.info(final_result)

    return {
        **final_result
    }


main = df.Orchestrator.create(orchestrator_function)
