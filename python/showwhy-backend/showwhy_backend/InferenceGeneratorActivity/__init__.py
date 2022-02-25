#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
import uuid
from typing import Dict

from showwhy_inference.inference import generate_all_specs
from shared_code.io.storage import get_storage_client
from shared_code.io.db import get_db_client

storage = get_storage_client()
db = get_db_client()

def main(body: Dict):
    logging.info(f"Generating specs for input: [{body}]")
    node_data = body['node_data']

    # Make sure the DB and blob storage containers exist before using them
    db.get_container()
    storage.create_container()

    specs = list(generate_all_specs(node_data['population_specs'],
                                    node_data['treatment_specs'],
                                    node_data['outcome_specs'],
                                    node_data['model_specs'],
                                    node_data['estimator_specs']))

    logging.info(f"Total specifications to execute: {len(specs)}")
    tasks = []
    for spec in specs:
        node = {
            'spec': spec,
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

    storage.write_output(body['session_id'], f"{body['execution_id']}_metadata", {
        'total_results': len(tasks)
    }, file_type='partial', extension='json')

    return tasks
