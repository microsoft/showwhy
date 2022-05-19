#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import itertools
import json
import operator
import traceback

from collections import ChainMap

import azure.functions as func

from showwhy_inference.inference import check_refutation_result

from shared_code.io.db import get_db_client
from shared_code.io.storage import get_storage_client


storage = get_storage_client()
db = get_db_client()


def main(req: func.HttpRequest) -> func.HttpResponse:

    session = req.params.get("session")
    instance = req.params.get("instance")

    try:
        records = db.get_records_for_execution_id(instance)
        records.sort(key=operator.itemgetter("task_id"))

        partial_results = []

        for _, records_for_task in itertools.groupby(
            records, operator.itemgetter("task_id")
        ):
            records_for_task = list(records_for_task)
            partial_results.append(dict(ChainMap(*records_for_task)))

        partial_results = sorted(
            partial_results, key=lambda k: k.get("estimated_effect", 0)
        )

        total_results = storage.read_output(
            session, f"{instance}_metadata.json", file_type="partial"
        )

        shap_results = {
            "shap_population_name",
            "shap_treatment",
            "shap_outcome",
            "shap_causal_model",
            "shap_estimator",
        }

        refute_completed = sum(
            map(
                lambda result: len([key for key in result.keys() if "refuter_" in key]),
                partial_results,
            )
        )

        confidence_interval_completed = sum(
            map(lambda result: "lower_bound" in result.keys(), partial_results)
        )

        shap_completed = sum(
            map(lambda result: shap_results.issubset(result.keys()), partial_results)
        )

        failed = sum(map(lambda result: "error" in result.keys(), partial_results))

        # add refutation result
        for result in partial_results:
            result["refutation_result"] = check_refutation_result(result)

        if shap_completed + failed >= total_results["total_results"]:
            status = "completed"
        else:
            status = "in_progress"

        return func.HttpResponse(
            body=json.dumps(
                {
                    **total_results,
                    "status": status,
                    "estimated_effect_completed": len(partial_results),
                    "refute_completed": refute_completed,
                    "confidence_interval_completed": confidence_interval_completed,
                    "shap_completed": shap_completed,
                    "failed": failed,
                    "partial_results": partial_results,
                }
            ),
            mimetype="application/json",
            status_code=200,
        )
    except Exception as e:
        return func.HttpResponse(
            body=json.dumps(
                {
                    "status": "calculating number of executions",
                    "additional_info": str(e),
                    "stacktrace": traceback.format_exc(),
                }
            ),
            mimetype="application/json",
            status_code=200,
        )
