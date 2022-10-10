#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import logging
from typing import List

import lightgbm as lgb
import pandas as pd
import shap
from sklearn import preprocessing
from sklearn.metrics import mean_absolute_error

from backend.exposure.model.shap_interpreter_models import (
    ListShapInterpreterResult,
    ShapInterpreterResult,
    ShapInterpreterSpec,
)


def get_tasks(estimate_effect_results):
    results_df = pd.DataFrame([result.to_dict() for result in estimate_effect_results])

    return [
        ShapInterpreterSpec(outcome_result=results_df[results_df["outcome"] == outcome])
        for outcome in results_df["outcome"].unique()
    ]


def interpret(
    spec_results: pd.DataFrame,
    spec_features: List,
    estimated_effect_col: str = "estimated_effect",
) -> pd.DataFrame:
    # encode categorical spec features
    encoded_features = []
    le = preprocessing.LabelEncoder()
    for feature in spec_features:
        spec_results[feature] = spec_results[feature].astype(str)
        spec_results[f"{feature}_encoded"] = le.fit_transform(spec_results[feature])
        encoded_features.append(f"{feature}_encoded")
    # create training data
    X = spec_results[encoded_features]
    y = spec_results[estimated_effect_col]
    train_data = lgb.Dataset(X, label=y, categorical_feature=encoded_features)
    # train a LightGBM regressor to predict estimated effects given spec features
    params = {
        "objective": "regression",
        "boosting_type": "gbdt",
        "max_depth": 3,
        "num_leaves": 5,
        "min_data_in_leaf": 1,
        "min_data_per_group": 1,
        "cat_smooth": 1,
    }
    spec_regressor = lgb.train(
        params=params, train_set=train_data, categorical_feature=encoded_features
    )
    # train performance
    y_hat = spec_regressor.predict(X)
    logging.info("Train MAE: {:.3f}".format(mean_absolute_error(y, y_hat)))
    # use SHAP for feature importance
    explainer = shap.TreeExplainer(spec_regressor)
    shap_values = explainer.shap_values(X)
    # save SHAP value for each spec feature
    for i, feature in enumerate(spec_features):
        spec_results[f"shap_{feature}"] = shap_values[:, i]
    # remove encoded feature columns from the final results
    cleaned_columns = [
        col for col in spec_results.columns if col not in encoded_features
    ]

    return ListShapInterpreterResult(
        results=[
            ShapInterpreterResult(
                estimate_id=row["id"],
                shap_population_name=row["shap_population_name"],
                shap_treatment=row["shap_treatment"],
                shap_outcome=row["shap_outcome"],
                shap_causal_model=row["shap_causal_model"],
                shap_estimator=row["shap_estimator"],
            )
            for _, row in spec_results[cleaned_columns].iterrows()
        ]
    )
