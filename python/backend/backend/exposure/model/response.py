#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List, Optional, Union

from pydantic import BaseModel

from backend.exposure.model.confidence_interval_models import ConfidenceIntervalResult
from backend.exposure.model.estimate_effect_models import EstimateResult
from backend.exposure.model.refute_estimate_models import RefuterResult
from backend.exposure.model.shap_interpreter_models import ListShapInterpreterResult
from backend.exposure.model.significance_test_models import SignificanceTestResult


class StatusModel(BaseModel):
    status: str
    completed: int
    pending: int
    failed: int
    results: Optional[
        Union[
            List[
                Union[
                    RefuterResult,
                    EstimateResult,
                    ConfidenceIntervalResult,
                    ListShapInterpreterResult,
                ]
            ],
            SignificanceTestResult,
        ]
    ] = None
    failures: Optional[
        Union[
            List[
                Union[
                    RefuterResult,
                    EstimateResult,
                    ConfidenceIntervalResult,
                    ListShapInterpreterResult,
                ]
            ],
            SignificanceTestResult,
        ]
    ] = None

    def to_dict(self):
        return {
            "status": self.status,
            "completed": self.completed,
            "pending": self.pending,
            "failed": self.failed,
            "results": [result.to_dict() for result in self.results]
            if isinstance(self.results, list)
            else self.results.to_dict(),
            "failures": [failure.to_dict() for failure in self.failures],
        }


class NumberOfExecutionsResult(BaseModel):
    count: int
