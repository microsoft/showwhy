/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Specification, Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useActualIndex(
	actualSteps: Step[],
): (index: number, spec: Specification) => number {
	return useCallback(
		(index: number, spec: Specification): number => {
			const step = actualSteps[index]
			return spec.steps
				? spec.steps.findIndex(s => JSON.stringify(s) === JSON.stringify(step))
				: -1
		},
		[actualSteps],
	)
}
