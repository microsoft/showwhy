#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import inspect
import logging
import re
from typing import Dict

from showwhy_inference import (causal_graph, confidence_interval,
                                   estimator, inference, refutation,
                                   specification_interpreter, inference_config)
from shared_code.io.notebook import new_code_cell, new_markdown_cell


def main(body: Dict) -> str:

    jupyter_cell_context = [
        "context = {}"
    ]
    dataframes = {spec['dataframe'] for spec in body['population_specs']}
    jupyter_cell_context.extend(
        [f'context["{dataframe}"] = ' + re.sub(r'\W+', '_', dataframe) for dataframe in dataframes])
    return [
        new_markdown_cell(["# Estimate Effects"]),
        new_markdown_cell(["## Additional Code"]),
        new_code_cell([
            re.sub(r'from shared_code.*', '', inspect.getsource(causal_graph))
        ]),
        new_code_cell([
            re.sub(r'from shared_code.*', '',
                   inspect.getsource(inference_config))
        ]),
        new_code_cell([
            re.sub(r'from shared_code.*', '', inspect.getsource(estimator))
        ]),
        new_code_cell([
            re.sub(r'from shared_code.*', '', inspect.getsource(refutation))
        ]),
        new_code_cell([
            re.sub(r'from shared_code.*', '',
                   inspect.getsource(specification_interpreter))
        ]),
        new_code_cell([
            re.sub(r'from shared_code.*', '', inspect.getsource(inference))
        ]),
        new_code_cell([
            re.sub(r'from shared_code.*', '',
                   inspect.getsource(confidence_interval))
        ]),
        new_code_cell([
            f"population_specs = {body['population_specs']}",
            f"treatment_specs = {body['treatment_specs']}",
            f"outcome_specs = {body['outcome_specs']}",
            f"model_specs = {body['model_specs']}",
            f"estimator_specs = {body['estimator_specs']}",
            f"refuter_specs = {body['refuter_specs']}"
        ]),
        new_code_cell(jupyter_cell_context),
        new_markdown_cell(["# Calculate estimated effects"]),
        new_code_cell([
            "specs = generate_all_specs(population_specs, treatment_specs, outcome_specs, model_specs, estimator_specs)",
            "results = []",
            "for spec in specs:",
            "    results.append(estimate_specification(spec, context))",
        ]),
        new_markdown_cell(["# Calculate Confidence Intervals"]),
        new_code_cell([
            "confidence_interval_results = []",
            "for previous_result in results:",
            "   _, _, estimate = previous_result['estimated_effect']",
            "   confidence_interval_result = ConfidenceInterval().estimate_confidence_intervals(estimate)",
            "   confidence_interval_results.append({**previous_result, **confidence_interval_result, 'estimated_effect': estimate.value})"
        ]),
        new_markdown_cell(["# Perform Refutation Tests"]),
        new_code_cell([
            "def create_refuter_specs(num_simulations: int) -> List:",
            "   refuter_specs = []",
            "   for test in DEFAULT_REFUTATION_TESTS:",
            "       spec = {",
            "                 'method_name': test,",
            "                 'num_simulations': num_simulations",
            "              }",
            "       refuter_specs.append(spec)",
            "   return refuter_specs"
        ]),
        new_code_cell([
            "refuter_specs = create_refuter_specs(refuter_specs['num_simulations'])",
            "specs = itertools.product(refuter_specs, results)",
            "refuter_results = []",
            "for refuter_spec, previous_result in specs:",
            "    causal_model, identified_estimand, estimate = previous_result['estimated_effect']",
            "    refuter_result = Refutation(refuter_spec).refute_estimate(causal_model, identified_estimand, estimate)",
            "    refuter_results.append({**previous_result, **refuter_result, 'estimated_effect': estimate.value})"
        ]),
        new_markdown_cell(["# Create Dataframe from results"]),
        new_code_cell([
            "final_results = confidence_interval_results + refuter_results",
            "results_df = join_results(final_results)",
            "results_df.head()"
        ]),
        new_markdown_cell(["# SHAP Analysis"]),
        new_code_cell([
            "results_df = run_interpreter(results_df)",
            "results_df.head()"
        ]),
    ]
