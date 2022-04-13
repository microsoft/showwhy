/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	EstimatorType,
	Handler1,
	Maybe,
	PrimarySpecificationConfig,
	Setter,
} from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

export function useOnDefaultChange(
	setDefaultEstimator: Setter<Maybe<EstimatorType>>,
	setPrimarySpecificationConfig: SetterOrUpdater<PrimarySpecificationConfig>,
): Handler1<EstimatorType> {
	return useCallback(
		(type: EstimatorType) => {
			setDefaultEstimator(type)
			setPrimarySpecificationConfig(prev => ({
				...prev,
				type,
			}))
		},
		[setDefaultEstimator, setPrimarySpecificationConfig],
	)
}
