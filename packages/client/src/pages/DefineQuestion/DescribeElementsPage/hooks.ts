/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IChoiceGroupOption } from '@fluentui/react'
import { useCallback } from 'react'
import { Hypothesis } from '~enums'
import { DescribeElements } from '~interfaces'
import { useDefineQuestion, useSetDefineQuestion } from '~state'

export function useBusinessLogic(): {
	defineQuestion: DescribeElements
	onInputChange: (
		value: string | undefined,
		type: string,
		field: string,
	) => void
	setHypothesis: (e: any, option: IChoiceGroupOption | undefined) => void
} {
	const defineQuestion = useDefineQuestion()
	const onInputChange = useOnInputChange()
	const setHypothesis = useSetHypothesis()
	return {
		defineQuestion,
		onInputChange,
		setHypothesis,
	}
}

function useOnInputChange(): (
	value: string | undefined,
	type: string,
	field: string,
) => void {
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()
	return useCallback(
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
}

function useSetHypothesis(): (
	e: any,
	option: IChoiceGroupOption | undefined,
) => void {
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()
	return useCallback(
		(e, option) => {
			if (option) {
				const newQuestion: DescribeElements = { ...defineQuestion }
				newQuestion.hypothesis = option.key as Hypothesis
				setDefineQuestion(newQuestion)
			}
		},
		[defineQuestion, setDefineQuestion],
	)
}
