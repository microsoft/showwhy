/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useQuestion, useSetQuestion } from '~state'

export function useOnInputChange(): (
	value: Maybe<string>,
	type: string,
	field: string,
) => void {
	const question = useQuestion()
	const setQuestion = useSetQuestion()
	return useCallback(
		(value, type, field) => {
			const newValues = {
				...(question as any)[type],
				[field]: value,
			} as Element

			const newElements = { ...question }
			;(newElements as any)[type] = newValues
			setQuestion(newElements)
		},
		[question, setQuestion],
	)
}
