#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict, List


__default_metadata = {"orig_nbformat": 4, "language_info": {"name": "python"}}


def create_notebook(
    cells: List = None, metadata: Dict = None, nbformat: int = 4, minor: int = 2
) -> str:
    return {
        "cells": cells if cells else [],
        "metadata": metadata if metadata else __default_metadata,
        "nbformat": nbformat,
        "nbformat_minor": minor,
    }


def new_markdown_cell(content: List) -> Dict:
    return {"cell_type": "markdown", "source": "\n".join(content), "metadata": {}}


def new_code_cell(content: List) -> Dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "source": "\n".join(content),
        "outputs": [],
        "metadata": {},
    }
