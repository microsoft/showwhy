#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict, List, Optional

import pandas as pd
from dowhy import CausalModel

from backend.exposure.inference.identify_estimand import identify_estimand
from backend.worker_commons.worker import backend_worker


@backend_worker.task
def identify_estimand_task(
    causal_graph: Dict,
    dataframe: Optional[pd.DataFrame],
    controls: List[str],
    treatment: str,
    outcome: str,
) -> CausalModel:
    return identify_estimand(causal_graph, dataframe, treatment, outcome, controls)
