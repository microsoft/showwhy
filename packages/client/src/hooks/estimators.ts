/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { EstimatorsGroups, EstimatorsType } from '~enums'
import { Estimator } from '~interfaces'
import { useEstimators } from '~state'

export const ESTIMATORS_LEARN_MORE_INFO = {
	exposure:
		'Exposure-assignment estimators: With these estimators, the goal is to create comparable groups after controlling for differences in confounders between groups. For each sample in the dataset, we first compute a propensity score, which defines the propensity of treatment given the confounder values. \
		Given the estimated propensity scores, we can create ‘pseudo-population’ consisting of balanced treatment and control groups using different methods, including inverse propensity weighting, propensity score matching, and propensity score stratification. \
		We can then estimate the average treatment effect as the outcome difference between treatment and control in the pseudo-population.',
	outcome:
		'Outcome-based estimators: With these estimators, the goal is to directly predict outcome value for each observation given the treatment and control variables. \
		Unlike exposure-assignment estimators, these methods are capable of estimating heterogeneous treatment effects at subgroup or individual levels.',
	inversePropensityWeighting:
		'We reweigh each sample in the dataset using its inverse propensity score to obtain similar distributions of confounders across treatment and control. \
		Average treatment effect can then be computed as the difference in re-weighted outcomes between these groups.',
	propensityScoreMatching:
		'For each subject in the treatment group, we find the closest subject in the control group (and vice versa) based on their propensity scores. \
		For each matched pair, we compute the difference of outcomes between the treated and control and average it over all pairs.',
	propensityScoreStratification:
		'We divide the dataset into a number of strata corresponding to ranges of propensity score values, and estimate the treatment effect for each of these strata. \
		These estimates are weighted by the number of data points in each stratum and summed up to compute a weighted average of the strata effects. ',
	forestDoublyRobustLearner:
		'Estimate heterogeneous effects of exposure when the exposure is binary or categorical.\
		It reduces the problem to first estimating two predictive tasks: 1) predicting the outcome from the exposure and control variables; 2) predicting the exposure from control variables. \
		Unlike the Double Machine Learning, the first model predicts the outcome from both the exposure and the control variables, as opposed to just the control variables. \
		The estimate is accurate whenever one of the two models is correctly specified. \
		Use the Forest Doubly Robust Learner if you have many features in your datasets, and want to model a fully flexible, non-linear relationship between effect size and control variables. \
		Note that this method is likely to take longer to execute compared to the Linear Doubly Robust Learner.',
	forestDoubleMachineLearning:
		'Estimate heterogeneous effects of exposure fo both binary, categorical and continuous exposure types. \
		It reduces the problem to first estimating two predictive tasks: 1) predicting the outcome from control variables; 2) predicting the exposure from control variables. \
		Double Machine Learning methods typically have lower variance than Doubly Robust Learner methods. \
		Use the Forest Double Machine Learning method if you have many features in your datasets, and want to model a fully flexible, non-linear relationship between effect size and control variables. \
		Note that this method is likely to take longer to execute compared to the Linear Doubly Robust Learner.',
	linearDoublyRobustLearner:
		'Estimate heterogeneous effects of exposure when the exposure is binary or categorical. \
		It reduces the problem to first estimating two predictive tasks: 1) predicting the outcome from the exposure and control variables; 2) predicting the exposure from control variables. \
		Unlike the Double Machine Learning, the first model predicts the outcome from both the exposure and the control variables, as opposed to just the control variables. \
		The estimate is accurate whenever one of the two models is correctly specified. \
		The linear doubly robust learner can model a flexible relationship between effect sizes and control variables, then project that flexible function onto a final linear model. \
		It works well with low-dimensional datasets.',
	linearDoubleMachineLearning:
		'Estimate heterogeneous effects of exposure fo both binary, categorical and continuous exposure types. \
		It reduces the problem to first estimating two predictive tasks: 1) predicting the outcome from control variables; 2) predicting the exposure from control variables. \
		Double Machine Learning methods typically have lower variance than Doubly Robust Learner methods. \
		It works well with low-dimensional datasets.',
	linearRegression:
		'We fit a simple regression model to predict outcome given treatment and control variables. \
		Note that this model requires a strong assumption that all relationships from treatment and control to outcome are linear.',
}

export const ESTIMATORS_SHORT_DESCRIPTION = {
	exposure:
		'Create comparable groups based on propensity of being assigned to the exposed group. Fast to execute.​',
	outcome:
		'Directly predict outcome for each subject based on exposure and control variables. May take a while to execute.​',
	inversePropensityWeighting:
		'Reweigh each sample in the dataset using its inverse propensity score to obtain similar distributions of confounders across the exposed and unexposed groups.',
	propensityScoreMatching:
		'For each subject in the exposed group, find the closest subject in the unexposed group (and vice versa) based on their propensity scores to create exposed-unexposed matched pairs.',
	propensityScoreStratification:
		'Divide the dataset into a number of strata corresponding to ranges of propensity score values, and estimate the exposure effect for each of these strata.',
	forestDoublyRobustLearner:
		'Estimate heterogenous effects of binary or categorical exposures by combining two predictive models: 1) predicting the outcome from the exposure and control variables;\
		 2) predicting the exposure from control variables.\
		 Unlike the Double Machine Learning, the first model predicts the outcome from both the exposure and the control variables, as opposed to just the control variables. \
		 The estimate is accurate whenever one of the two models is correctly specified, but typically has higher variance compared to Double Machine Learning methods. \
		 The forest version can handle high-dimensional datasets and model a fully flexible, non-linear relationship between effect size and control variables, but may take longer to execute compared to the Linear Doubly Robust Learner.',
	forestDoubleMachineLearning:
		'Estimate heterogenous effects of exposures by combining two predictive tasks:\
		 1) predicting the outcome from the control variables; 2) predicting the exposure from control variables. \
		 Unlike the Doubly Robust Learners, this method can handle both binary, categorical, and continuous exposure types. \
		 The forest version can handle high-dimensional datasets and model a non-linear relationship between effect size and control variables,\
		 but may take longer to execute compared to the Linear Double Machine Learning method.',
	linearDoublyRobustLearner:
		'Estimate heterogenous effects of binary or categorical exposures by combining two predictive models: 1) predicting the outcome from the exposure and control variables;\
		 2) predicting the exposure from control variables.\
		 Unlike the Double Machine Learning, the first model predicts the outcome from both the exposure and the control variables, as opposed to just the control variables. \
		 The estimate is accurate whenever one of the two models is correctly specified, but typically has higher variance compared to Double Machine Learning methods. \
		 The linear version works well with low-dimensional datasets.',
	linearDoubleMachineLearning:
		'Estimate heterogenous effects of exposures by combining two predictive tasks:\
		 1) predicting the outcome from the control variables; 2) predicting the exposure from control variables. \
		 Unlike the Doubly Robust Learners, this method can handle both binary, categorical, and continuous exposure types. \
		 The linear version works well with low-dimensional datasets.',
	linearRegression:
		'Estimate heterogenous effects of exposure by predicting outcome based on exposure and control variables using a simple linear model.\
		 Assume all relationships from treatment and control to outcome are linear.',
}

export const EXPOSURE_ESTIMATORS: Estimator[] = [
	{
		group: EstimatorsGroups.ExposureEstimator,
		type: EstimatorsType.PropensityScoreStratification,
	},
	{
		group: EstimatorsGroups.ExposureEstimator,
		type: EstimatorsType.InversePropensityWeighting,
	},
	{
		group: EstimatorsGroups.ExposureEstimator,
		type: EstimatorsType.PropensityScoreMatching,
	},
]

export const OUTCOME_ESTIMATORS: Estimator[] = [
	{
		group: EstimatorsGroups.OutcomeEstimator,
		type: EstimatorsType.LinearDoubleMachineLearning,
	},
	{
		group: EstimatorsGroups.OutcomeEstimator,
		type: EstimatorsType.LinearDoublyRobustLearner,
	},
	{
		group: EstimatorsGroups.OutcomeEstimator,
		type: EstimatorsType.LinearRegression,
	},
	{
		group: EstimatorsGroups.OutcomeEstimator,
		type: EstimatorsType.ForestDoubleMachineLearning,
	},
	{
		group: EstimatorsGroups.OutcomeEstimator,
		type: EstimatorsType.ForestDoublyRobustLearner,
	},
]

export const ESTIMATORS: Estimator[] = [
	...EXPOSURE_ESTIMATORS,
	...OUTCOME_ESTIMATORS,
].map((e, i) => ({ ...e, order: i }))

export const ESTIMATOR_HELP_TEXT = (type: string): string => {
	switch (type) {
		case EstimatorsType.LinearDoublyRobustLearner:
			return ESTIMATORS_LEARN_MORE_INFO.linearDoublyRobustLearner
		case EstimatorsType.ForestDoublyRobustLearner:
			return ESTIMATORS_LEARN_MORE_INFO.forestDoublyRobustLearner
		case EstimatorsType.LinearDoubleMachineLearning:
			return ESTIMATORS_LEARN_MORE_INFO.linearDoubleMachineLearning
		case EstimatorsType.ForestDoubleMachineLearning:
			return ESTIMATORS_LEARN_MORE_INFO.forestDoubleMachineLearning
		case EstimatorsType.LinearRegression:
			return ESTIMATORS_LEARN_MORE_INFO.linearRegression
		case EstimatorsType.InversePropensityWeighting:
			return ESTIMATORS_LEARN_MORE_INFO.inversePropensityWeighting
		case EstimatorsType.PropensityScoreMatching:
			return ESTIMATORS_LEARN_MORE_INFO.propensityScoreMatching
		case EstimatorsType.PropensityScoreStratification:
			return ESTIMATORS_LEARN_MORE_INFO.propensityScoreStratification
		case EstimatorsGroups.ExposureEstimator:
			return ESTIMATORS_LEARN_MORE_INFO.exposure
		case EstimatorsGroups.OutcomeEstimator:
			return ESTIMATORS_LEARN_MORE_INFO.outcome
		default:
			return ''
	}
}

export const ESTIMATOR_SHORT_DESCRIPTION = (type: string): string => {
	switch (type) {
		case EstimatorsType.LinearDoublyRobustLearner:
			return ESTIMATORS_SHORT_DESCRIPTION.linearDoublyRobustLearner
		case EstimatorsType.ForestDoublyRobustLearner:
			return ESTIMATORS_SHORT_DESCRIPTION.forestDoublyRobustLearner
		case EstimatorsType.LinearDoubleMachineLearning:
			return ESTIMATORS_SHORT_DESCRIPTION.linearDoubleMachineLearning
		case EstimatorsType.ForestDoubleMachineLearning:
			return ESTIMATORS_SHORT_DESCRIPTION.forestDoubleMachineLearning
		case EstimatorsType.LinearRegression:
			return ESTIMATORS_SHORT_DESCRIPTION.linearRegression
		case EstimatorsType.InversePropensityWeighting:
			return ESTIMATORS_SHORT_DESCRIPTION.inversePropensityWeighting
		case EstimatorsType.PropensityScoreMatching:
			return ESTIMATORS_SHORT_DESCRIPTION.propensityScoreMatching
		case EstimatorsType.PropensityScoreStratification:
			return ESTIMATORS_SHORT_DESCRIPTION.propensityScoreStratification
		case EstimatorsGroups.ExposureEstimator:
			return ESTIMATORS_SHORT_DESCRIPTION.exposure
		case EstimatorsGroups.OutcomeEstimator:
			return ESTIMATORS_SHORT_DESCRIPTION.outcome
		default:
			return ''
	}
}

export function useForestDoublyRobustLearner(
	estimators = useEstimators(),
): Estimator[] {
	return useMemo((): Estimator[] => {
		const estimator = estimators.filter(
			x => x.type === EstimatorsType.ForestDoublyRobustLearner,
		)
		return estimator
	}, [estimators])
}

export function useLinearDoublyRobustLearner(
	estimators = useEstimators(),
): Estimator[] {
	return useMemo((): Estimator[] => {
		const estimator = estimators.filter(
			x => x.type === EstimatorsType.LinearDoublyRobustLearner,
		)
		return estimator
	}, [estimators])
}

export function useExposureAssignedEstimators(
	estimators = useEstimators(),
): Estimator[] {
	return useMemo((): Estimator[] => {
		const estimator = estimators.filter(
			x =>
				x.type === EstimatorsType.InversePropensityWeighting ||
				x.type === EstimatorsType.PropensityScoreMatching ||
				x.type === EstimatorsType.PropensityScoreStratification,
		)
		return estimator
	}, [estimators])
}

export function useOutcomeBasedEstimators(
	estimators = useEstimators(),
): Estimator[] {
	return useMemo((): Estimator[] => {
		const estimator = estimators.filter(
			x =>
				x.type === EstimatorsType.LinearRegression ||
				x.type === EstimatorsType.LinearDoublyRobustLearner ||
				x.type === EstimatorsType.LinearDoubleMachineLearning ||
				x.type === EstimatorsType.ForestDoubleMachineLearning ||
				x.type === EstimatorsType.ForestDoublyRobustLearner,
		)
		return estimator
	}, [estimators])
}

export function useExposureEstimatorsList(): Estimator[] {
	return EXPOSURE_ESTIMATORS
}

export function useOutcomeEstimatorsList(): Estimator[] {
	return OUTCOME_ESTIMATORS
}

export function useEstimatorsList(): Estimator[] {
	return ESTIMATORS
}

export function useEstimatorHelpText(): (type: string) => string {
	return ESTIMATOR_HELP_TEXT
}

export function useEstimatorShortDescription(): (type: string) => string {
	return ESTIMATOR_SHORT_DESCRIPTION
}
