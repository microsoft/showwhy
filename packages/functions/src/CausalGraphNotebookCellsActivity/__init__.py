#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from shared_code.io.notebook import new_code_cell, new_markdown_cell


def main(body: Dict) -> str:

    node_data = body['node_data']
    gml_graph = body['gml_graph']

    cell_list = [
        new_markdown_cell(["# Build Causal Graph"]),
        new_code_cell([
            "import dowhy",
            "from IPython.display import Image, display"]
        )]

    # if no real dataframe is passed on, create dummy data with required columns to pass to doWhy
    model_data_name = "model_data"
    if node_data['dataframe'] == "None":
        columns = node_data['controls'] + \
            [node_data['treatment'], node_data['outcome']]
        model_columns = [f'"{column}"' for column in columns]
        model_data_cell = new_code_cell([
            f'columns=[{", ".join(model_columns)}]',
            f'{model_data_name}=pd.DataFrame(columns=columns)']
        )
        cell_list.append(model_data_cell)
    else:
        model_data_name = node_data['dataframe']

    # create causal graph
    cell_list.append(new_code_cell([
        f'gml_graph = """{gml_graph}"""',
        f"{node_data['result']} = dowhy.CausalModel(data={model_data_name}, treatment='{node_data['treatment']}', outcome='{node_data['outcome']}', graph=gml_graph)",
        f"{node_data['result']}.view_model()",
        f"display(Image(filename='causal_model.png'))"
    ]))

    return cell_list
