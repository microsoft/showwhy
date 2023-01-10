import json
import os

# import rpy2
# print("rpy2", rpy2.__version__)
import rpy2.robjects as robjects
from rpy2.robjects import pandas2ri
from rpy2.robjects.conversion import localconverter

pandas2ri.activate()

# from rpy2.robjects.packages import importr
# import R's "synthdid" package
# synthdid = importr('synthdid')
# print("synthdid", synthdid.__version__)

# Loading the functions we have defined in R
r_script_file = "{}/synthdid_simple.r".format(os.path.dirname(os.path.realpath(__file__)))
robjects.r["source"](r_script_file)
execEstimator_r = robjects.globalenv["execEstimator"]

from collections import OrderedDict

import numpy as np
from rpy2.robjects.vectors import DataFrame, FloatVector, IntVector, ListVector, Matrix, StrVector


def recurse_r_tree(data):
    """
    step through an R object recursively and convert the types to python types as appropriate.
    Leaves will be converted to e.g. numpy arrays or lists as appropriate and the whole tree to a dictionary.
    """
    r_dict_types = [DataFrame, ListVector]
    r_array_types = [FloatVector, IntVector, Matrix]
    r_list_types = [StrVector]
    if type(data) in r_dict_types:
        return OrderedDict(zip(data.names, [recurse_r_tree(elt) for elt in data]))
    elif type(data) in r_list_types:
        return [recurse_r_tree(elt) for elt in data]
    elif type(data) in r_array_types:
        return np.array(data)
    else:
        if hasattr(data, "rclass"):  # An unsupported r class
            raise KeyError(
                "Could not proceed, type {} is not defined"
                "to add support for this type, just add it to the imports "
                "and to the appropriate type list above".format(type(data))
            )
        else:
            return data  # We reached the end of recursion


# input data is a panda dataframe
def exec_estimator_R(df, estimator="sdid"):
    """
    Input data is a panda dataframe.
    This function will execute the synthdid R package to compute the causal impact estimate.
    The user can pass "sdid", "did", or "sc" as the estimator choice.
    """
    # convert the panda df into into r object dataframe
    with localconverter(robjects.default_converter + pandas2ri.converter):
        df_r = robjects.conversion.py2rpy(df)

    # call synthdid's lib R function (passing df_r) to prepare data
    # we could also pass df_r and let the execEstimator_r call the panel.matrices internally
    setup_r = robjects.r["panel.matrices"](df_r)

    # execute the estimate
    # TODO: replace synthdid_estimate with other estimates as needed, e.g. sc_estimate, did_estimate
    result_r = execEstimator_r(setup_r, estimator)

    # convert the result from R into python-compatible (dict) object
    result = recurse_r_tree(result_r)
    return json.loads(result[0])  # result
