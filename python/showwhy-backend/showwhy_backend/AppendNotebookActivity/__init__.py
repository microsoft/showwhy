#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import Dict

from shared_code.io.notebook import create_notebook, new_code_cell, new_markdown_cell
from shared_code.io.storage import get_storage_client


storage = get_storage_client()


def main(body: Dict) -> str:
    session_id = body["session_id"]
    try:
        notebook_data = storage.read_output(session_id, "notebook.ipynb")
    except:
        logging.info("Notebook file not found, creating one")
        notebook_data = create_notebook(
            cells=[
                new_markdown_cell(["# Install Dependencies"]),
                new_code_cell(
                    [
                        "!pip install git+https://github.com/microsoft/dowhy.git econml==0.12.0 pandas==1.3.0 xgboost==1.4.2 numba==0.53.1 numpy==1.21.0 graphviz==0.17 matplotlib==3.4.2"
                    ]
                ),
                new_code_cell(["import pandas as pd"]),
            ]
        )

    notebook_data["cells"].extend(body["cells"])

    notebook_file = storage.write_output(
        session_id, "notebook", notebook_data, extension="ipynb"
    )

    return {"notebook_file": notebook_file}
