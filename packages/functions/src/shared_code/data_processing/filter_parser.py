#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict


class OperationNotSupported(RuntimeError):
    """
    Error when the operation is not supported on the parser
    The add_operation method can be used to add a new operation to the parser
    """
    pass


class JsonLogicParser:
    def __init__(self):
        self.operations = {
            "contains": lambda x: f"{x[0]['var']}.str.lower().str.contains({self.__transform_for_query(x[1])})",
            ">": lambda x: f"{x[0]['var']} > {self.__transform_for_query(x[1])}",
            ">=": lambda x: f"{x[0]['var']} >= {self.__transform_for_query(x[1])}",
            "<": lambda x: f"{x[0]['var']} < {self.__transform_for_query(x[1])}",
            "<=": lambda x: f"{x[0]['var']} <= {self.__transform_for_query(x[1])}",
            "==": lambda x: f"{x[0]['var']} == {self.__transform_for_query(x[1])}",
            "!=": lambda x: f"{x[0]['var']} != {self.__transform_for_query(x[1])}",
            "in range": lambda x: f"{x[0]['var']}.between({self.__transform_for_query(x[1])}, {self.__transform_for_query(x[2])}, {x[3]})"
        }

    def add_operation(self, operator: str, operation: callable) -> None:
        """Adds a new operation to the parser

        Args:
            operator (str): the name of the operation
            operation (callable): the callable that returns a string for the query
        """
        self.operations[operator] = operation

    def parse_filter(self, expression: Dict) -> str:
        """Parse the dictionary filter into a query string for pandas using python engine

        Args:
            expression (Dict): The expression as a dictionary example:
            {
                "and": [
                    {"contains": [{"var": "column_name"}, "hello"]},
                    {">": [{"var": "column_name_2}, 23]}
                ]
            }
            Output: (column_name.str.lower().str.contains('hello')) and (column_name_2 > 23)

            another example:
            {
                "and": [
                    {"or": [
                        {"contains": [{"var": "column_name"}, "hello"]},
                        {"==": [{"var": "column_name_3"}, "world"]}
                    ],
                    {">": [{"var": "column_name_2}, 23]}
                ]
            }
            Output: ((column_name.str.lower().str.contains('hello')) or (column_name_3 == world)) and (column_name_2 > 23)

        Raises:
            OperationNotSupported: When the operation is not implemented

        Returns:
            [str]: String containing the query ready to be used for a dataframe query function
        """
        current_key = list(expression.keys())[0]

        if current_key in ['or', 'and']:
            current_expresion = expression[current_key]
            expressions = [self.parse_filter(expr)
                           for expr in current_expresion]
            return f' {current_key} '.join(expressions)
        elif current_key == 'not':
            return f'not ({self.parse_filter(expression[current_key][0])})'
        elif current_key in self.operations:
            return self.operations[current_key](expression[current_key])
        else:
            raise OperationNotSupported(
                f"Operation: {current_key} is not supported")

    @staticmethod
    def __transform_for_query(value: any) -> any:
        """This method will return the correct parameter for comparison in a pandas query string
        If value is a string it will add quotes around the string, if it is a number or other type
        it will not have quotes

        Args:
            value ([any]): value to transform

        Returns:
            [any]: the correct value for pandas query
        """
        if isinstance(value, str):
            return f"'{value}'"
        else:
            return value
