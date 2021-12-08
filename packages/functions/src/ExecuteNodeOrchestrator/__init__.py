#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
from typing import Dict

import azure.durable_functions as df
from shared_code.exception.invalid_request import InvalidRequestException

node_type_mapping = {
    'EstimateEffectNode': "InferenceOrchestrator",
    'CausalGraphNode': "CausalGraphOrchestrator",
    'IdentifyEstimandNode': "IdentifyEstimandOrchestrator",
    'SignificanceTestNode': "SignificanceTestOrchestrator"
}


def __validate_request(data: Dict):
    if 'session_id' not in data or ('node_data' not in data and 'nodes' not in data):
        raise InvalidRequestException(
            "Parameters 'session_id' and ('node_data' or 'nodes') must be present in the request body")


def orchestrator_function(context: df.DurableOrchestrationContext):

    data = context.get_input()

    try:
        __validate_request(data)
    except InvalidRequestException as invalid_request:
        return {
            'error': str(invalid_request)
        }

    logging.info(f'Input is: {data}')

    if 'node_data' in data:
        nodes = [data['node_data']]
    else:
        nodes = data['nodes']

    results = {}

    for node in nodes:
        node_data = node
        body = {
            'session_id': data['session_id'],
            'node_data': node
        }
        node_type = node_data['type']
        if node_type in node_type_mapping:
            result = yield context.call_sub_orchestrator(
                node_type_mapping[node_type], body)
        else:
            result = yield context.call_sub_orchestrator(
                "DataProcessingOrchestrator", body)

        results[node['id']] = result

    return results


main = df.Orchestrator.create(orchestrator_function)
