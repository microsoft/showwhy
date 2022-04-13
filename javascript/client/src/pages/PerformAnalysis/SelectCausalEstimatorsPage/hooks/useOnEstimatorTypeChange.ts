/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Estimator,
	EstimatorGroup,
	Handler1,
	Setter,
} from '@showwhy/types'
import { useCallback } from 'react'

import { BatchUpdateAction } from '../SelectCausalEstimatorsPage.types'

export function useOnEstimatorTypeChange(
	estimatorsList: Estimator[],
	selectedEstimatorGroups: EstimatorGroup[],
	batchUpdateSelectedEstimators: (
		estimators: Estimator[],
		action: BatchUpdateAction,
	) => void,
	setSelectedEstimatorGroups: Setter<EstimatorGroup[]>,
): Handler1<EstimatorGroup> {
	return useCallback(
		(group: EstimatorGroup) => {
			const action: BatchUpdateAction = selectedEstimatorGroups.includes(group)
				? BatchUpdateAction.Delete
				: BatchUpdateAction.Add
			batchUpdateSelectedEstimators(
				estimatorsList.filter(e => e.group === group),
				action,
			)
			setSelectedEstimatorGroups(prev =>
				prev.includes(group) ? prev.filter(e => e !== group) : [...prev, group],
			)
		},
		[
			estimatorsList,
			selectedEstimatorGroups,
			batchUpdateSelectedEstimators,
			setSelectedEstimatorGroups,
		],
	)
}
