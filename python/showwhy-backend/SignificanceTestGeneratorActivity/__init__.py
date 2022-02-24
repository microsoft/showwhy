#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import uuid
from typing import Dict
from shared_code.io.db import get_db_client

from shared_code.io.storage import get_storage_client
from shared_code.inference.significance_test import calculate_all_propensity_scores
from shared_code.inference.inference_config import DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS

storage = get_storage_client()
db = get_db_client()


def main(body: Dict):
    logging.info(f"Generating specs for input: [{body}]")
    node_data = body['node_data']
    session_id = body['session_id']

    # Make sure the DB and blob storage containers exist before using them
    db.get_container()
    storage.create_container()
    context = storage.read_context(session_id)

    inference_spec_ids = node_data['spec_ids']

    inference_results = []
    for spec_id in inference_spec_ids:
        result = storage.read_output(
            session_id, f'{spec_id}.pickle', file_type='partial')
        inference_results.append(result)

    inference_results = calculate_all_propensity_scores(inference_results)
    context["original_inference_results"] = inference_results
    storage.write_context(context)
    logging.info(
        f"Total specifications for significance test: {len(inference_results)}")

    tasks = []
    for i in range(DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS):
        node = {
            **node_data
        }
        new_input_data = {
            'write_context': False,
            'node_data': node,
            'session_id': body['session_id'],
            'task_id': str(uuid.uuid4()),
            'execution_id': body['execution_id'],
            'partial': True
        }
        tasks.append(new_input_data)

    return tasks
