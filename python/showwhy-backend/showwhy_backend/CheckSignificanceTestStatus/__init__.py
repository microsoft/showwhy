#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import json

import azure.functions as func
from shared_code.io.db import get_db_client
from shared_code.io.storage import get_storage_client
from showwhy_inference.inference_config import DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS

storage = get_storage_client()
db = get_db_client()


def main(req: func.HttpRequest) -> func.HttpResponse:

    instance = req.params.get('instance')

    try:
        records = db.get_records_for_execution_id(instance)
        simulation_completed = len(
            [result for result in records if 'median_null_effect' in result])
        simulation_completed = DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS \
            if simulation_completed >= DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS else simulation_completed
        logging.info(f'Simulations completed: {simulation_completed}')

        significance_test_results = [
            p_value_result for p_value_result in records if 'p_value' in p_value_result]
        if len(significance_test_results) > 0:
            status = 'completed'
            test_results = {
                'p_value': significance_test_results[0]['p_value'],
                'significance': significance_test_results[0]['significance']
            }
        else:
            status = 'in_progress'
            test_results = {}

        return func.HttpResponse(
            body=json.dumps({
                'status': status,
                'total_simulations': DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS,
                'simulation_completed': simulation_completed,
                'test_results': test_results
            }),
            mimetype='application/json',
            status_code=200
        )
    except:
        return func.HttpResponse(
            body=json.dumps({
                'status': 'executing significance test'
            }),
            mimetype='application/json',
            status_code=200
        )
