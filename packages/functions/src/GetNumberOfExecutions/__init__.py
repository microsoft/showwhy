#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json

import azure.functions as func
from shared_code.inference.inference import generate_all_specs


def main(req: func.HttpRequest) -> func.HttpResponse:

    body = json.loads(req.get_body())
    node_data = body['node_data']

    specs = list(generate_all_specs(node_data['population_specs'],
                                    node_data['treatment_specs'],
                                    node_data['outcome_specs'],
                                    node_data['model_specs'],
                                    node_data['estimator_specs']))

    return func.HttpResponse(
        body=json.dumps({
            'total_executions': len(specs)
        })
    )
