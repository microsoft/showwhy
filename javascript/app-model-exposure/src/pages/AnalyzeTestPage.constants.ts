/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'

import type { Estimator } from '../types/estimators/Estimator.js'
import { EstimatorGroup } from '../types/estimators/EstimatorGroup.js'
import { EstimatorType } from '../types/estimators/EstimatorType.js'

export const estimatorGroups: IChoiceGroupOption[] = [
	{
		key: EstimatorGroup.Exposure,
		text: EstimatorGroup.Exposure,
	},
	{
		key: EstimatorGroup.Outcome,
		text: EstimatorGroup.Outcome,
	},
]

// Lower value, higher rank
export const estimatorRanking = [
	{
		key: EstimatorType.LinearDoubleMachineLearning,
		value: 1,
	},
	{
		key: EstimatorType.ForestDoubleMachineLearning,
		value: 2,
	},
	{
		key: EstimatorType.LinearDoublyRobustLearner,
		value: 3,
	},
	{
		key: EstimatorType.ForestDoublyRobustLearner,
		value: 4,
	},
	{
		key: EstimatorType.PropensityScoreStratification,
		value: 5,
	},
	{
		key: EstimatorType.InversePropensityWeighting,
		value: 6,
	},
	{
		key: EstimatorType.PropensityScoreMatching,
		value: 7,
	},
	{
		key: EstimatorType.LinearRegression,
		value: 8,
	},
]

export const ESTIMATORS_SHORT_DESCRIPTION = {
	exposure: `Create comparable groups based on propensity of being assigned to the exposed group. Fast to execute.`,
	outcome: `Directly predict outcome for each subject based on exposure and control variables. May take a while to execute.`,
	inversePropensityWeighting: `Reweigh each sample in the dataset using its inverse propensity score to obtain similar distributions of confounders across the exposed and unexposed groups.`,
	propensityScoreMatching: `For each subject in the exposed group, find the closest subject in the unexposed group (and vice versa) based on their propensity scores to create exposed-unexposed matched pairs.`,
	propensityScoreStratification: `Divide the dataset into a number of strata corresponding to ranges of propensity score values, and estimate the exposure effect for each of these strata.`,
	forestDoublyRobustLearner: `Estimate heterogenous effects of binary or categorical exposures by combining two predictive models: 1) predicting the outcome from the exposure and control variables;
		 2) predicting the exposure from control variables.
		 Unlike the Double Machine Learning, the first model predicts the outcome from both the exposure and the control variables, as opposed to just the control variables. 
		 The estimate is accurate whenever one of the two models is correctly specified, but typically has higher variance compared to Double Machine Learning methods. 
		 The forest version can handle high-dimensional datasets and model a fully flexible, non-linear relationship between effect size and control variables, but may take longer to execute compared to the Linear Doubly Robust Learner.`,
	forestDoubleMachineLearning: `Estimate heterogenous effects of exposures by combining two predictive tasks:
		 1) predicting the outcome from the control variables; 2) predicting the exposure from control variables. 
		 Unlike the Doubly Robust Learners, this method can handle both binary, categorical, and continuous exposure types. 
		 The forest version can handle high-dimensional datasets and model a non-linear relationship between effect size and control variables,
		 but may take longer to execute compared to the Linear Double Machine Learning method.`,
	linearDoublyRobustLearner: `Estimate heterogenous effects of binary or categorical exposures by combining two predictive models: 1) predicting the outcome from the exposure and control variables;
		 2) predicting the exposure from control variables.
		 Unlike the Double Machine Learning, the first model predicts the outcome from both the exposure and the control variables, as opposed to just the control variables. 
		 The estimate is accurate whenever one of the two models is correctly specified, but may have higher variance compared to the Double Machine Learning method.`,
	linearDoubleMachineLearning: `Estimate heterogenous effects of exposures by combining two predictive tasks:
		 1) predicting the outcome from the control variables; 2) predicting the exposure from control variables. 
		 Unlike the Doubly Robust Learner, this method can handle both binary, categorical, and continuous exposure types.`,
	linearRegression: `Estimate heterogenous effects of exposure by predicting outcome based on exposure and control variables using a simple linear model.
		 Assume all relationships from treatment and control to outcome are linear.`,
}

export const EXPOSURE_ESTIMATORS: Estimator[] = [
	{
		group: EstimatorGroup.Exposure,
		type: EstimatorType.PropensityScoreStratification,
	},
	{
		group: EstimatorGroup.Exposure,
		type: EstimatorType.InversePropensityWeighting,
	},
	{
		group: EstimatorGroup.Exposure,
		type: EstimatorType.PropensityScoreMatching,
	},
]

export const OUTCOME_ESTIMATORS: Estimator[] = [
	{
		group: EstimatorGroup.Outcome,
		type: EstimatorType.LinearDoubleMachineLearning,
	},
	{
		group: EstimatorGroup.Outcome,
		type: EstimatorType.LinearDoublyRobustLearner,
	},
	{
		group: EstimatorGroup.Outcome,
		type: EstimatorType.LinearRegression,
	},
]

export const ESTIMATORS: Estimator[] = [
	...EXPOSURE_ESTIMATORS,
	...OUTCOME_ESTIMATORS,
].map((e, i) => ({ ...e, order: i }))

export const ESTIMATORS_HAVE_COVARIATE = [
	EstimatorType.PropensityScoreStratification,
	EstimatorType.InversePropensityWeighting,
]

export const OUTPUT_FILE_NAME = 'output.csv'
export const REFUTATION_HELP_TEXT = `Number of simulations attempting to refute each estimate - more
simulations can give more confidence in the validity of the
estimated effects`
export const CONFIDENCE_INTERVAL_HELP_TEXT = `Exposure-assignment and Linear Regression models compute
confidence intervals by repeatedly rerunning the estimates with
bootstrapped samples, which may take a while to execute`

export const COVARIATE_HELP_TEXT = `Constrain the allowable variation between exposure and control
groups in terms of their covariates`
