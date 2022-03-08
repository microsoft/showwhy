#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from shared_code.io.notebook import new_code_cell, new_markdown_cell


def main(body: Dict) -> str:

    node_data = body["node_data"]

    return [
        new_markdown_cell(["# Identify Estimands"]),
        new_code_cell(
            [
                f"{node_data['result']} = {node_data['causal_model']}.identify_effect(proceed_when_unidentifiable=True)",
                f"print({node_data['result']})",
            ]
        ),
    ]
