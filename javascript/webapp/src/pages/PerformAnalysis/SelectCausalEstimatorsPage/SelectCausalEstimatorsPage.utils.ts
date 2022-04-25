/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Estimator,
	Maybe,
	PrimarySpecificationConfig,
	Setter,
} from '@showwhy/types'
import { EstimatorGroup, EstimatorType } from '@showwhy/types'
import type { SetterOrUpdater } from 'recoil'

import {
	estimatorRanking,
	ESTIMATORS_SHORT_DESCRIPTION,
} from './SelectCausalEstimatorsPage.constants'
import { BatchUpdateAction } from './SelectCausalEstimatorsPage.types'

const defaultEstimatorRanking = estimatorRanking.reduce((acc, curr) => {
	acc[curr.key] = curr.value
	return acc
}, {} as { [key: string]: number })

export function getEstimatorByRanking(
	estimators: EstimatorType[],
): EstimatorType {
	const ranking = estimators.map(
		estimator => defaultEstimatorRanking[estimator],
	) as number[]
	const min = Math.min(...ranking)
	const index = ranking.indexOf(min)
	return estimators[index] as EstimatorType
}

export function changeDefaultEstimator(
	setDefaultEstimator: Setter<Maybe<EstimatorType>>,
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>,
	type: EstimatorType,
): void {
	setDefaultEstimator(type)
	setPrimarySpecificationConfig(prev => ({
		...prev,
		type,
	}))
}

export const getShortDescriptionByType = (type: string): string => {
	switch (type) {
		case EstimatorType.LinearDoublyRobustLearner:
			return ESTIMATORS_SHORT_DESCRIPTION.linearDoublyRobustLearner
		case EstimatorType.ForestDoublyRobustLearner:
			return ESTIMATORS_SHORT_DESCRIPTION.forestDoublyRobustLearner
		case EstimatorType.LinearDoubleMachineLearning:
			return ESTIMATORS_SHORT_DESCRIPTION.linearDoubleMachineLearning
		case EstimatorType.ForestDoubleMachineLearning:
			return ESTIMATORS_SHORT_DESCRIPTION.forestDoubleMachineLearning
		case EstimatorType.LinearRegression:
			return ESTIMATORS_SHORT_DESCRIPTION.linearRegression
		case EstimatorType.InversePropensityWeighting:
			return ESTIMATORS_SHORT_DESCRIPTION.inversePropensityWeighting
		case EstimatorType.PropensityScoreMatching:
			return ESTIMATORS_SHORT_DESCRIPTION.propensityScoreMatching
		case EstimatorType.PropensityScoreStratification:
			return ESTIMATORS_SHORT_DESCRIPTION.propensityScoreStratification
		case EstimatorGroup.Exposure:
			return ESTIMATORS_SHORT_DESCRIPTION.exposure
		case EstimatorGroup.Outcome:
			return ESTIMATORS_SHORT_DESCRIPTION.outcome
		default:
			return ``
	}
}

export function batchUpdate(
	action: BatchUpdateAction,
	estimators: Estimator[],
	setEstimators: SetterOrUpdater<Estimator[]>,
): void {
	switch (action) {
		case BatchUpdateAction.Add:
			setEstimators(prev => [
				...prev,
				...estimators.filter(
					estimator => !prev.map(e => e.type).includes(estimator.type),
				),
			])
			break
		case BatchUpdateAction.Delete:
			setEstimators(prev =>
				prev.filter(
					estimator => !estimators.map(e => e.type).includes(estimator.type),
				),
			)
			break
		default:
			return
	}
}
