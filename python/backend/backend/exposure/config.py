#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import os

DEFAULT_REFUTATION_TESTS = ["random_common_cause", "placebo_treatment_refuter"]

SENSITIVITY_REFUTERS = ["add_unobserved_common_cause"]


def get_redis_url():
    redis_url = os.environ.get("REDIS_URL")
    if redis_url:
        return redis_url
    else:
        raise Exception("REDIS_URL configuration missing in environment")


def get_storage_url():
    storage_location = os.environ.get("STORAGE")
    if storage_location:
        return storage_location
    else:
        raise Exception("STORAGE configuration missing in environment")


def get_refuters():
    include_sensitivity_refuters = (
        os.environ.get("INCLUDE_SENSITIVITY_REFUTERS", "false").strip().lower()
        == "true"
    )

    return (
        DEFAULT_REFUTATION_TESTS + SENSITIVITY_REFUTERS
        if include_sensitivity_refuters
        else DEFAULT_REFUTATION_TESTS
    )


def get_confidence_simulations():
    return int(os.environ.get("DEFAULT_CI_SIMULATIONS", 5))


def get_significance_simulations():
    return int(os.environ.get("DEFAULT_SIGNIFICANCE_SIMULATIONS", 100))
