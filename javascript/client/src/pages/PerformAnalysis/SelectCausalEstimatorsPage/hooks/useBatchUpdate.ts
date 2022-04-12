/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Estimator } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { BatchUpdateAction } from '../SelectCausalEstimatorsPage.types'

export function useBatchUpdate(
	setEstimators: SetterOrUpdater<Estimator[]>,
): (estimators: Estimator[], action: BatchUpdateAction) => void {
	return useCallback(
		(estimators: Estimator[], action: BatchUpdateAction) => {
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
							estimator =>
								!estimators.map(e => e.type).includes(estimator.type),
						),
					)
					break
				default:
					return
			}
		},
		[setEstimators],
	)
}
