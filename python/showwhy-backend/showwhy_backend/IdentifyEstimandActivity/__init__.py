#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import Dict

from shared_code.io.storage import get_storage_client


storage = get_storage_client()


def main(body: Dict) -> str:

    session_id = body["session_id"]
    node_data = body["node_data"]
    context = storage.read_context(session_id)

    context[node_data["result"]] = context[node_data["causal_model"]].identify_effect(
        proceed_when_unidentifiable=True
    )
    logging.info(context[node_data["result"]])

    # check if backdoor estimate is possible
    if context[node_data["result"]].estimands["backdoor"] is not None:
        estimate_possibility = True
    else:
        estimate_possibility = False

    # save backdoor and instrumental variables to send to front end
    context["estimand_identification_variables"] = {
        "estimate_possibility": estimate_possibility,
        "backdoor_variables": context[node_data["result"]].get_backdoor_variables(),
        "frontdoor_variables": context[node_data["result"]].get_frontdoor_variables(),
        "instrumental_variables": context[
            node_data["result"]
        ].get_instrumental_variables(),
    }

    storage.write_context(context)

    return context["estimand_identification_variables"]
