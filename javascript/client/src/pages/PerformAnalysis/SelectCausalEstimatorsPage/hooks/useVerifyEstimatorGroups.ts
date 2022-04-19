/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Estimator, EstimatorGroup, Handler, Setter } from '@showwhy/types'
import { useCallback } from 'react'
import { estimatorGroups } from '../SelectCausalEstimatorsPage.constants'

export function useVerifyEstimatorGroups(
	estimatorsList: Estimator[],
	estimators: Estimator[],
	setSelectedEstimatorGroups: Setter<EstimatorGroup[]>,
): Handler {
	return useCallback(() => {
		estimatorGroups.forEach(item => {
			const group: EstimatorGroup = item.key as EstimatorGroup
			const groupEstimators = estimatorsList
				.filter(e => e.group === group)
				.map(e => e.type)
			const hasEstimators = estimators.some(estimator =>
				groupEstimators.includes(estimator.type),
			)
			setSelectedEstimatorGroups(prev =>
				hasEstimators ? [...prev, group] : prev.filter(g => g !== group),
			)
		})
	}, [estimators, estimatorsList, setSelectedEstimatorGroups])
}
