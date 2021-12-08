#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict, List

import pandas as pd
from shared_code.data_processing.filter_parser import (JsonLogicParser,
                                                       OperationNotSupported)


class DataAggregationParser:
    def __init__(self):
        self.operation_executors = {
            "count": lambda x: x.count(),
            "sum": lambda x: x.sum(),
            "min": lambda x: x.min(),
            "max": lambda x: x.max(),
            "mean": lambda x: x.mean(),
            "median": lambda x: x.median(),
            "any": lambda x: x.any(),
            "first": lambda x: x.first(),
            "last": lambda x: x.last()
        }

        self.operation_expressions = {
            "count": lambda x: f"{x}.count()",
            "sum": lambda x: f"{x}.sum()",
            "min": lambda x: f"{x}.min()",
            "max": lambda x: f"{x}.max()",
            "mean": lambda x: f"{x}.mean()",
            "median": lambda x: f"{x}.median()",
            "any": lambda x: f"{x}.any()",
            "first": lambda x: f"{x}.first()",
            "last": lambda x: f"{x}.last()"
        }

        # filter parser used to support numeric and string conditionals
        self.filter_parser = JsonLogicParser()

    def add_operation(self, operator: str, operation_executor: callable, operation_expression: callable) -> None:
        """
        Adds a new operation to the parser
        Args:
            operator (str): the name of the operation
            operation_executor (callable): the callable that returns the aggregated results
            operation_expression (callable): the callable that returns a string representing the aggregate expression
        """
        self.operation_executors[operator] = operation_executor
        self.operation_expressions[operator] = operation_expression

    def execute_aggregate(self, data: pd.DataFrame, agg_expression: Dict) -> Dict:
        """
        Execute an aggregate expresson specified as a dictionary:
        Args:
            data: the groupby object on which we will apply the aggregate function
            agg_expression (Dict): the aggregate expression

            Example: 
            {
                "input_column": "column_name_1",
                "output_column": "column_name_count",
                "agg_operator": "count" 
            }
            Output for execution: {"column_name_count": data["column_name_1"].count()}

        Raises:
            OperationNotSupported: When the operation is not implemented

        Returns:
            Dict of {output_column: aggregated_result}
        """
        agg_operator = agg_expression.get("agg_operator")
        if agg_operator in self.operation_executors:
            # get input column
            input_column = agg_expression.get("input_column")
            if input_column is None:
                raise OperationNotSupported(
                    f"Operation: Missing input column for {agg_operator} count")
            else:
                # get output_column, if not specified we set output_column = input_column
                output_column = agg_expression.get("output_column")
                if output_column is None:
                    output_column = input_column

                # for aggregation with condition, we parse the filter expression into a string
                filter = agg_expression.get("filter")
                if filter is not None:
                    filter_expression = self.filter_parser.parse_filter(filter)
                    return {output_column: self.operation_executors[agg_operator]((data.query(filter_expression)[input_column]))}
                else:
                    return {output_column: self.operation_executors[agg_operator]((data[input_column]))}
        else:
            raise OperationNotSupported(
                f"Operation: {agg_operator} operator is not supported")

    def execute_aggregate_list(self, data: pd.DataFrame, agg_expression_list: List) -> pd.Series:
        """
        Enables multiple aggregate operations to be applied on a dataframe
        Args:
            data: the groupby object on which we will apply the aggregate function
            agg_expression_list (List): a list of aggregate expressions
            Example:
            [
                {
                    "input_column": "column_name_1",
                    "output_column": "column_name_count",
                    "agg_operator": "count",
                    "filter": {">=": [{"var": "column_name_1"}, 1]}
                },
                {
                    "input_column": "column_name_2",
                    "output_column": "column_name_sum",
                    "agg_operator": "sum",
                    "filter": {"==": [{"var": "column_name_2"}, 3]}
                },
            ]

        Returns:
            pd.Series: with output_columns as indices and output of aggregate function executions as values 
        """
        executor_dict = dict()
        for expression in agg_expression_list:
            executor_dict.update(self.execute_aggregate(data, expression))
        return pd.Series(executor_dict)

    def parse_aggregate(self, agg_expression: Dict) -> str:
        """
        Similar to execute_aggregate, but return a string representing the aggregate operation to be displayed in Jupyter notebook
        Args:
            data: the groupby object on which we will apply the aggregate function
            agg_expression (Dict): the aggregate expression

            Example 1: 
            {
                "input_column": "column_name_1",
                "output_column": "column_name_count",
                "agg_operator": "count" 
            }
            Output for execution: "{'column_name_count': x['column_name_1'].count()}"

            Example 2:
            {
                "input_column": "column_name_1",
                "output_column": "column_name_count",
                "agg_operator": "count",
                "filter": {">=": [{"var": "column_name_1"}, 1]}
            }
            Output: "{'column_name_count': (x.query('column_name_1 >= 1')['column_name_1']).count()}"

        Raises:
            OperationNotSupported: When the operation is not implemented

        Returns:
            string representing the aggregate operation
        """
        agg_operator = agg_expression.get("agg_operator")
        if agg_operator in self.operation_executors:
            input_column = agg_expression.get("input_column")
            if input_column is None:
                raise OperationNotSupported(
                    f"Operation: Missing input column for {agg_operator} count")
            else:
                output_column = agg_expression.get("output_column")
                if output_column is None:
                    output_column = input_column

                filter = agg_expression.get("filter")
                if filter is not None:
                    filter_expression = self.filter_parser.parse_filter(filter)
                    agg_string = self.operation_expressions[agg_operator](
                        f"(x.query('{filter_expression}')['{input_column}'])")
                    return f"'{output_column}': {agg_string}"
                else:
                    agg_string = self.operation_expressions[agg_operator](
                        f"x['{input_column}']")
                    return f"'{output_column}': {agg_string}"
        else:
            raise OperationNotSupported(
                f"Operation: {agg_operator} operator is not supported")

    def parse_aggregate_list(self, agg_expression_list: List) -> str:
        """
        Concatnate all aggregate strings to be displayed in the jupyter notebook command
        """
        expressions = list()
        for expression in agg_expression_list:
            expressions.append(self.parse_aggregate(expression))
        return "{" + ', '.join(expressions) + "}"
