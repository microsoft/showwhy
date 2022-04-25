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
import type { SetterOrUpdater } from 'recoil'

import { BatchUpdateAction } from '../SelectCausalEstimatorsPage.types'
import { batchUpdate } from '../SelectCausalEstimatorsPage.utils'

export function useOnEstimatorTypeChange(
	estimatorsList: Estimator[],
	selectedEstimatorGroups: EstimatorGroup[],
	setEstimators: SetterOrUpdater<Estimator[]>,
	setSelectedEstimatorGroups: Setter<EstimatorGroup[]>,
): Handler1<EstimatorGroup> {
	return useCallback(
		(group: EstimatorGroup) => {
			const action: BatchUpdateAction = selectedEstimatorGroups.includes(group)
				? BatchUpdateAction.Delete
				: BatchUpdateAction.Add
			batchUpdate(
				action,
				estimatorsList.filter(e => e.group === group),
				setEstimators,
			)
			setSelectedEstimatorGroups(prev =>
				prev.includes(group) ? prev.filter(e => e !== group) : [...prev, group],
			)
		},
		[
			estimatorsList,
			selectedEstimatorGroups,
			setEstimators,
			setSelectedEstimatorGroups,
		],
	)
}
