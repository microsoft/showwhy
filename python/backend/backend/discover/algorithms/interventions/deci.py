import logging
from typing import Dict, Optional

import numpy as np
import pandas as pd
import torch
from causica.models.deci.deci import DECI
from celery import uuid

from backend.worker_commons.io.db import get_db_client


class DeciInterventionModel:
    def __init__(
        self,
        deci_model: DECI,
        adj_matrix: np.ndarray,
        train_data: pd.DataFrame,
        intervention_model_id: Optional[str] = None,
    ):
        self._id = intervention_model_id if intervention_model_id else uuid()
        self._deci_model = deci_model
        self._adj_matrix = adj_matrix
        self._train_data = train_data

    @property
    def id(self):
        return self._id

    def perform_intervention(
        self,
        interventions: Dict[str, float],
    ) -> Dict[str, float]:
        intervention_idxs = []
        intervention_values = []

        for name, value in interventions.items():
            idx = self._deci_model.variables.name_to_idx[name]
            if idx is not None:
                intervention_idxs.append(self._deci_model.variables.name_to_idx[name])
                intervention_values.append(value)
            else:
                logging.warning(
                    f"Intervention column {name} ignored: column name not found"
                )

        intervention_idxs = torch.tensor(
            intervention_idxs, device=self._deci_model.device
        )
        intervention_values = torch.tensor(
            intervention_values, device=self._deci_model.device
        )

        raw_result = self._deci_model._counterfactual(
            X=torch.tensor(self._train_data.values, device=self._deci_model.device),
            W_adj=torch.from_numpy(self._adj_matrix)
            .float()
            .to(self._deci_model.device),
            intervention_idxs=intervention_idxs,
            intervention_values=intervention_values,
        ).numpy()

        return {
            var.name: raw_result[:, i].mean()
            for i, var in enumerate(self._deci_model.variables)
        }

    def save(self):
        db_client = get_db_client()
        db_client.set_value(f"intervention_model:{self._id}", self)

    @staticmethod
    def load(intervention_model_id: str):
        db_client = get_db_client()
        return db_client.get_value(f"intervention_model:{intervention_model_id}")
