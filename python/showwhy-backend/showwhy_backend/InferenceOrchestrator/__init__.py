#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import time
import os
from typing import Dict

import azure.durable_functions as df
from shared_code.exception.invalid_request import InvalidRequestException
from showwhy_inference.inference_config import get_batch_size, get_batch


ESTIMATE_EFFECT_BATCH_SIZE = get_batch_size('ESTIMATE_EFFECT_BATCH_SIZE')
CONFIDENCE_INTERVAL_BATCH_SIZE =  get_batch_size('CONFIDENCE_INTERVAL_BATCH_SIZE')
REFUTER_BATCH_SIZE =  get_batch_size('REFUTER_BATCH_SIZE')


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

    logging.info(f'Executing InferenceOrchestrator with input: [{data}]')

    # Estimate effect
    inference_inputs = yield context.call_activity("InferenceGeneratorActivity", data)
    inference_results = []
    for size, current, batch in get_batch(inference_inputs, ESTIMATE_EFFECT_BATCH_SIZE):
        tasks = [context.call_activity("InferenceExecuteActivity", task_inputs)
                 for task_inputs in batch]
        partial_results = yield context.task_all(tasks)
        inference_results.extend(partial_results)
        logging.info("Sleeping for 1 second...")
        logging.info(f"Estimate Effect: {current} of {size} completed")
        time.sleep(1)

    logging.info("Estimate Effect completed")

    inference_results = [{'output_file': result['output_file'], 'task_id': result['task_id']}
                         for result in inference_results if result['output_file'] is not None]

    # Refute Estimated Effect
    refuter_inputs = yield context.call_activity("RefuteGeneratorActivity", {
        'refuter_specs': data['node_data']['refuter_specs'],
        'session_id': data['session_id'],
        'inference_results': inference_results,
        'execution_id': context.parent_instance_id
    })

    confidence_refuter_results = []
    if data['node_data']['confidence_interval']:
        # Calculate confidence intervals
        confidence_inputs = yield context.call_activity("ConfidenceIntervalGeneratorActivity", {
            'session_id': data['session_id'],
            'inference_results': inference_results,
            'execution_id': context.parent_instance_id
        })

        context.set_custom_status({
            'step': 'Calculating Refuter and Confidence Interval Results'
        })
        for size, current, batch in get_batch(confidence_inputs, CONFIDENCE_INTERVAL_BATCH_SIZE):
            tasks = [context.call_activity("ConfidenceIntervalActivity", task_inputs)
                     for task_inputs in batch]
            partial_results = yield context.task_all(tasks)
            confidence_refuter_results.extend(partial_results)
            logging.info("Sleeping for 1 second...")
            logging.info(f"Confidence Interval: {current} of {size} completed")
            time.sleep(1)

        logging.info("Confidence Interval Completed")

    for size, current, batch in get_batch(refuter_inputs, REFUTER_BATCH_SIZE):
        tasks = [context.call_activity("RefuteActivity", task_inputs)
                 for task_inputs in batch]
        partial_results = yield context.task_all(tasks)
        confidence_refuter_results.extend(partial_results)
        logging.info("Sleeping for 1 second...")
        logging.info(f"Refuter: {current} of {size} completed")
        time.sleep(1)

    logging.info("Refuter Completed")

    results = [result for result in confidence_refuter_results if result]

    join_result = yield context.call_activity("InferenceJoinResultActivity", {
        'session_id': data['session_id'],
        'result': data['node_data']['result'],
        'results': results
    })

    context.set_custom_status({
        'step': 'Running SHAP Analysis'
    })

    final_result = yield context.call_activity("ShapExecutionActivity", {
        'session_id': data['session_id'],
        'results_file_path': join_result['output'],
        'result': data['node_data']['result'],
        'execution_id': context.parent_instance_id
    })

    cells = yield context.call_activity("InferenceNotebookCellsActivity", data['node_data'])

    notebook_result = yield context.call_activity("AppendNotebookActivity", {
        'session_id': data['session_id'],
        'cells': cells
    })

    context.set_custom_status({
        'step': 'Completed'
    })

    return {
        **final_result,
        **notebook_result
    }


main = df.Orchestrator.create(orchestrator_function)
