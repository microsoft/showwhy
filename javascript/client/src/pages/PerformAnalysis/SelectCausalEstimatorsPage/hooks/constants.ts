/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import { EstimatorGroup, EstimatorType } from '~types'

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
const estimatorRanking = [
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
