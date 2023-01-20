#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import copy
from typing import Dict

from sklearn.model_selection import GridSearchCV, KFold, StratifiedKFold
from xgboost import XGBClassifier, XGBRegressor


class CausalEstimator:
    """
    Create estimator configurations for a given estimator method
    using a format expected by DoWhy
    """

    def __init__(self, classifier=None, regressor=None, parallelism=False):
        """
        Create default xgboost classifier and regressor models
        that could be used at different stages of an estimator.
        Using grid search to auto tune hyperparameters for these models.
        """
        self.parallelism = parallelism

        if classifier:
            self.model_classifier = classifier
        else:
            # classifier params
            self.classifier_kwargs = {
                "learning_rate": 0.1,
                "n_estimators": 100,
                "objective": "binary:logistic",
                "nthread": -1 if parallelism else 1,
                "use_label_encoder": False,
                "random_state": 42,
                "verbosity": 0,
            }
            self.default_model_classifier = XGBClassifier(max_depth=3, **self.classifier_kwargs)
            self.model_classifier = GridSearchCV(
                estimator=XGBClassifier(**self.classifier_kwargs),
                param_grid={"max_depth": [3, 5], "colsample_bytree": [0.5, 0.8, 1.0]},
                cv=StratifiedKFold(n_splits=3, shuffle=True, random_state=42),
                n_jobs=1,
                scoring="neg_log_loss",
                refit=False,
                verbose=0,
            )

        if regressor:
            self.model_regressor = regressor
        else:
            # regressor params
            self.regressor_kwargs = {
                "learning_rate": 0.1,
                "n_estimators": 100,
                "objective": "reg:squarederror",
                "nthread": -1 if parallelism else 1,
                "random_state": 42,
                "verbosity": 0,
            }

            self.default_model_regressor = XGBRegressor(max_depth=3, **self.regressor_kwargs)

            self.model_regressor = GridSearchCV(
                estimator=XGBRegressor(**self.regressor_kwargs),
                param_grid={"max_depth": [3, 5], "colsample_bytree": [0.5, 0.8, 1.0]},
                cv=KFold(n_splits=3, shuffle=True, random_state=42),
                n_jobs=1,
                scoring="neg_mean_squared_error",
                refit=False,
                verbose=0,
            )

        self.estimator_configurators = {
            "backdoor.econml.dr.ForestDRLearner": "config_forest_doubly_robust",
            "backdoor.econml.dr.LinearDRLearner": "config_doubly_robust",
            "backdoor.econml.dml.CausalForestDML": "config_forest_double_machine_learning",
            "backdoor.econml.dml.LinearDML": "config_double_machine_learning",
            "backdoor.propensity_score_weighting": "config_propensity_weighting",
            "backdoor.propensity_score_matching": "config_propensity_matching",
            "backdoor.propensity_score_stratification": "config_propensity_stratification",
            "backdoor.linear_regression": "config_default",
        }

    def config_estimator(self, estimator_spec: Dict) -> Dict:
        config_method = self.estimator_configurators.get(estimator_spec["method_name"])
        if config_method is None:
            return estimator_spec
        else:
            return getattr(self, config_method)(estimator_spec)

    def config_doubly_robust(self, estimator_spec: Dict) -> Dict:
        """
        Config parameters for Linear/Forest Doubly Robust Learner
        """

        estimator_spec["method_params"] = {
            "init_params": {
                "model_propensity": self.model_classifier,
                "model_regression": self.model_regressor,
                "cv": KFold(n_splits=3, shuffle=True, random_state=42),
                "random_state": 42,
            },
            "fit_params": {},
        }
        return estimator_spec

    def config_double_machine_learning(self, estimator_spec: Dict) -> Dict:
        """
        Config parameters for Linear/Forest Double Machine Learning
        """
        estimator_spec["method_params"] = {
            "init_params": {
                "model_t": self.model_classifier,
                "model_y": self.model_regressor,
                "discrete_treatment": True,
                "cv": KFold(n_splits=3, shuffle=True, random_state=42),
                "random_state": 42,
            },
            "fit_params": {},
        }
        return estimator_spec

    def config_forest_double_machine_learning(self, estimator_spec: Dict) -> Dict:
        estimator_spec = self.config_double_machine_learning(estimator_spec)
        estimator_spec["method_params"]["init_params"]["n_jobs"] = -1 if self.parallelism else None
        return estimator_spec

    def config_forest_doubly_robust(self, estimator_spec: Dict) -> Dict:
        estimator_spec = self.config_doubly_robust(estimator_spec)
        estimator_spec["method_params"]["init_params"]["n_jobs"] = -1 if self.parallelism else None
        return estimator_spec

    def config_propensity_weighting(self, estimator_spec: Dict) -> Dict:
        """
        Config parameters for Inverse Propensity Weighting
        """
        estimator_spec["method_params"] = {
            "propensity_score_model": self.model_classifier,
            "recalculate_propensity_score": True,
            "propensity_score_column": "propensity_score",
            "weighting_scheme": "ips_weight",
            "min_ps_score": 0.05,
            "max_ps_score": 0.95,
        }
        return estimator_spec

    def config_propensity_stratification(self, estimator_spec: Dict) -> Dict:
        """
        Config parameters for Propensity Score Stratification
        Number of strata is auto-selected within DoWhy
        """
        estimator_spec["method_params"] = {
            "recalculate_propensity_score": True,
            "propensity_score_model": self.model_classifier,
            "propensity_score_column": "propensity_score",
            "num_strata": "auto",
            "clipping_threshold": 5,
        }
        return estimator_spec

    def config_propensity_matching(self, estimator_spec: Dict) -> Dict:
        """
        Config parameters for Propensity Score Matching
        """
        estimator_spec["method_params"] = {
            "recalculate_propensity_score": True,
            "propensity_score_model": self.model_classifier,
        }

        return estimator_spec

    def config_default(self, estimator_spec: Dict) -> Dict:
        """
        Default setting with no configurations
        """
        estimator_spec["method_params"] = {}
        return estimator_spec

    def tune_classifier_model(self, identified_estimand, causal_model):
        """
        Tune hyperparameters for propensity model
        """
        observed_common_causes = copy.deepcopy(identified_estimand.get_backdoor_variables())
        if len(observed_common_causes) > 0:
            treatment_var = identified_estimand.treatment_variable
            variables = observed_common_causes + treatment_var
            training_data = causal_model._data[variables].drop_duplicates()
            best_params = self.model_classifier.fit(
                training_data[observed_common_causes], training_data[treatment_var]
            ).best_params_
            best_model = XGBClassifier(**best_params, **self.classifier_kwargs)
            return best_model
        else:
            return self.default_model_classifier

    def tune_dml_regressor_model(self, identified_estimand, causal_model):
        """
        Tune hyperparameters for first stage regressor model for Double ML model
        """
        observed_common_causes = copy.deepcopy(identified_estimand.get_backdoor_variables())
        if len(observed_common_causes) > 0:
            outcome_var = identified_estimand.outcome_variable
            variables = observed_common_causes + outcome_var
            training_data = causal_model._data[variables].drop_duplicates()
            best_params = self.model_regressor.fit(
                training_data[observed_common_causes], training_data[outcome_var]
            ).best_params_
            best_model = XGBRegressor(**best_params, **self.regressor_kwargs)
            return best_model
        else:
            return self.default_model_regressor

    def tune_dr_regressor_model(self, identified_estimand, causal_model):
        """
        Tune hyperparameters for first stage regressor model for doubly robust learner
        """
        observed_common_causes = copy.deepcopy(identified_estimand.get_backdoor_variables())
        if len(observed_common_causes) > 0:
            treatment_var = identified_estimand.treatment_variable
            outcome_var = identified_estimand.outcome_variable
            features = observed_common_causes + treatment_var
            variables = features + outcome_var
            training_data = causal_model._data[variables].drop_duplicates()
            best_params = self.model_regressor.fit(training_data[features], training_data[outcome_var]).best_params_
            best_model = XGBRegressor(**best_params, **self.regressor_kwargs)
            return best_model
        else:
            return self.default_model_regressor
