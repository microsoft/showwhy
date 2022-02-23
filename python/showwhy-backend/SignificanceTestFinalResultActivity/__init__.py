#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging
from typing import Dict

from shared_code.io.db import get_db_client
from shared_code.io.storage import get_storage_client
from shared_code.inference.significance_test import perform_significance_test

storage = get_storage_client()
db = get_db_client()


def main(body: Dict):
    session_id = body['session_id']
    execution_id = body['execution_id']
    context = storage.read_context(session_id)
    inference_results = context["original_inference_results"]
    null_results = [result['median_null_effect']
                    for result in body['null_effect_results']]

    p_value_result = perform_significance_test(inference_results, null_results)

    record = {
        'session_id': session_id,
        'execution_id': execution_id,
        **p_value_result
    }
    logging.info(record)
    db.insert_record(record)
    record.pop('_id', None)
    return record
