#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict
import logging

from shared_code.inference.specification_interpreter import run_interpreter
from shared_code.io.storage import get_storage_client
from shared_code.io.db import get_db_client

storage = get_storage_client()
db = get_db_client()

def main(body: Dict) -> str:

    session_id = body['session_id']
    results_file_name = body['results_file_path']
    result_name = body['result']
    execution_id = body['execution_id']

    context = storage.read_context(session_id)

    valid_results_df = storage.read_output(
        session_id, results_file_name, file_type='partial')

    final_results = run_interpreter(valid_results_df)

    context[result_name] = final_results

    storage.write_context(context)

    final_results_file = storage.write_output(
        session_id, result_name, final_results, extension='csv')

    for index, row in final_results.iterrows():
        record = {
            'task_id': row['task_id'],
            'execution_id': execution_id,
            'shap_population_name': row['shap_population_name'],
            'shap_treatment': row['shap_treatment'],
            'shap_outcome': row['shap_outcome'],
            'shap_causal_model': row['shap_causal_model'],
            'shap_estimator': row['shap_estimator']
        }
        logging.info(record)
        db.insert_record(record)

    return {
        'output': final_results_file
    }
