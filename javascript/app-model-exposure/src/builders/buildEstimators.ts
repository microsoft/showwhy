/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Estimator } from '../types/estimators/Estimator.js'
import { EstimatorGroup } from '../types/estimators/EstimatorGroup.js'
import { EstimatorType } from '../types/estimators/EstimatorType.js'

export interface BuiltEstimator {
	type: string
	label: EstimatorType
	require_propensity_score: boolean
	method_name: string
}

export function buildEstimators(estimators: Estimator[]): BuiltEstimator[] {
	return estimators.map(estimator => ({
		type: getModelTypeByEstimatorGroup(estimator.group),
		label: estimator.type ?? EstimatorType.InversePropensityWeighting,
		require_propensity_score: estimator.type !== EstimatorType.LinearRegression,
		method_name: `backdoor.${getModelNameByEstimatorType(estimator.type)}`,
	}))
}

function getModelTypeByEstimatorGroup(group: EstimatorGroup): string {
	switch (group) {
		case EstimatorGroup.Exposure:
			return 'Treatment Assignment Model'
		case EstimatorGroup.Outcome:
			return 'Outcome Model'
	}
}

function getModelNameByEstimatorType(type: EstimatorType): string {
	switch (type) {
		case EstimatorType.ForestDoubleMachineLearning:
			return 'econml.dml.CausalForestDML'
		case EstimatorType.LinearDoubleMachineLearning:
			return 'econml.dml.LinearDML'
		case EstimatorType.ForestDoublyRobustLearner:
			return 'econml.dr.ForestDRLearner'
		case EstimatorType.LinearDoublyRobustLearner:
			return 'econml.dr.LinearDRLearner'
		case EstimatorType.LinearRegression:
			return 'linear_regression'
		case EstimatorType.PropensityScoreMatching:
			return 'propensity_score_matching'
		case EstimatorType.PropensityScoreStratification:
			return 'propensity_score_stratification'
		case EstimatorType.InversePropensityWeighting:
			return 'propensity_score_weighting'
	}
}
