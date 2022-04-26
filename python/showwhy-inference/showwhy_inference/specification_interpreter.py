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
class SpecificationIntepreter:
    """
    Estimate the contribution of each specification feature to the estimated effect
    using SHAP intepreter
    """
    def __init__(
        self,
        spec_results: pd.DataFrame,
        spec_features: List,
        estimated_effect_col: str = "estimated_effect",
    ):
        self.spec_results = spec_results
        self.spec_features = spec_features
        self.estimated_effect_col = estimated_effect_col
    def interpret(self) -> pd.DataFrame:
        # encode categorical spec features
        encoded_features = []
        le = preprocessing.LabelEncoder()
        for feature in self.spec_features:
            self.spec_results[feature] = self.spec_results[feature].astype(str)
            self.spec_results[f"{feature}_encoded"] = le.fit_transform(
                self.spec_results[feature]
            )
            encoded_features.append(f"{feature}_encoded")
        # create training data
        X = self.spec_results[encoded_features]
        y = self.spec_results[self.estimated_effect_col]
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
        for i, feature in enumerate(self.spec_features):
            self.spec_results[f"shap_{feature}"] = shap_values[:, i]
        # remove encoded feature columns from the final results
        cleaned_columns = [
            col for col in self.spec_results.columns if col not in encoded_features
        ]
        return self.spec_results[cleaned_columns]
def run_interpreter(results_df: pd.DataFrame) -> pd.DataFrame:
    spec_features = [
        "population_name",
        "treatment",
        "outcome",
        "causal_model",
        "estimator",
    ]
    shap_results = []
    outcomes = results_df.outcome.unique()
    for outcome in outcomes:
        outcome_results_df = results_df[results_df["outcome"] == outcome]
        spec_interpreter = SpecificationIntepreter(outcome_results_df, spec_features)
        outcome_shap_results_df = spec_interpreter.interpret()
        shap_results.append(outcome_shap_results_df)
    final_results_df = pd.concat(shap_results, axis=0, ignore_index=True)
    return final_results_df