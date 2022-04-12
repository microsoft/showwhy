/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EstimatorType } from '@showwhy/types'

import { estimatorRanking } from './SelectCausalEstimatorsPage.types'

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
