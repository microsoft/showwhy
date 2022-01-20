/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { useDefineQuestion, useSetDefineQuestion } from '~state'

export function useBusinessLogic() {
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()

	const onInputChange = useCallback(
		(value, type, field) => {
			const newValues = {
				...defineQuestion[type],
				[field]: value,
			} as Element

			const newElements = { ...defineQuestion }
			newElements[type] = newValues
			setDefineQuestion(newElements)
		},
		[defineQuestion, setDefineQuestion],
	)

	const setHypothesis = useCallback(
		(e, option) => {
			const newQuestion = { ...defineQuestion }
			newQuestion.hypothesis = option.key
			setDefineQuestion(newQuestion)
		},
		[defineQuestion, setDefineQuestion],
	)

	return {
		defineQuestion,
		onInputChange,
		setHypothesis,
	}
}
