/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IChoiceGroupOption } from '@fluentui/react'

import { EstimatorsGroups, EstimatorsType } from '~enums'

export const estimatorGroups: IChoiceGroupOption[] = [
	{
		key: EstimatorsGroups.ExposureEstimator,
		text: EstimatorsGroups.ExposureEstimator,
	},
	{
		key: EstimatorsGroups.OutcomeEstimator,
		text: EstimatorsGroups.OutcomeEstimator,
	},
]

// Lower value, higher rank
const estimatorRanking = [
	{
		key: EstimatorsType.LinearDoubleMachineLearning,
		value: 1,
	},
	{
		key: EstimatorsType.ForestDoubleMachineLearning,
		value: 2,
	},
	{
		key: EstimatorsType.LinearDoublyRobustLearner,
		value: 3,
	},
	{
		key: EstimatorsType.ForestDoublyRobustLearner,
		value: 4,
	},
	{
		key: EstimatorsType.PropensityScoreStratification,
		value: 5,
	},
	{
		key: EstimatorsType.InversePropensityWeighting,
		value: 6,
	},
	{
		key: EstimatorsType.PropensityScoreMatching,
		value: 7,
	},
	{
		key: EstimatorsType.LinearRegression,
		value: 8,
	},
]

const defaultEstimatorRanking = estimatorRanking.reduce((acc, curr) => {
	acc[curr.key] = curr.value
	return acc
}, {} as { [key: string]: number })

export function getEstimatorByRanking(
	estimators: EstimatorsType[],
): EstimatorsType {
	const ranking = estimators.map(
		estimator => defaultEstimatorRanking[estimator],
	)
	const min = Math.min(...ranking)
	const index = ranking.indexOf(min)
	return estimators[index]
}
