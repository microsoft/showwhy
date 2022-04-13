/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useExperiment, useSetExperiment } from '~state'

export function useOnInputChange(): (
	value: Maybe<string>,
	type: string,
	field: string,
) => void {
	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	return useCallback(
		(value, type, field) => {
			const newValues = {
				...(defineQuestion as any)[type],
				[field]: value,
			} as Element

			const newElements = { ...defineQuestion }
			;(newElements as any)[type] = newValues
			setDefineQuestion(newElements)
		},
		[defineQuestion, setDefineQuestion],
	)
}
