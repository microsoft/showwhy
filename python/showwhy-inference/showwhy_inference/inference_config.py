#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import os


DEFAULT_REFUTATION_TESTS = [
    "random_common_cause",
    "placebo_treatment_refuter",
    "data_subset_refuter",
    "bootstrap_refuter",
]

# Failing these refuters should only result in warning,
# not automatic rejection of the estimate
SENSITIVITY_REFUTERS = ["add_unobserved_common_cause"]

# whether to include sensitivity test
INCLUDE_SENSITIVITY_REFUTERS = False

# default number of simulations used for refutation
DEFAULT_REFUTATION_SIMULATIONS = 100

# default number of simulations used for bootstrap-based confidence intervals
DEFAULT_CI_SIMULATIONS = 100

# default number of simlations used for significance test computation
DEFAULT_SIGNIFICANCE_TEST_SIMULATIONS = 100


def get_batch_size(env_var):
    batch_size = os.environ.get(env_var, None)
    if batch_size is not None:
        return int(batch_size)
    else:
        return None


def get_batch(iterable, size):
    if size is None:
        size = len(iterable)
    length = len(iterable)
    for start in range(0, length, size):
        end = min(start + size, length)
        yield (length, end, iterable[start:end])
