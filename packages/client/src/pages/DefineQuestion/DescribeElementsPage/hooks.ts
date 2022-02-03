/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IChoiceGroupOption } from '@fluentui/react'
import { useCallback } from 'react'
import { useDefineQuestion, useSetDefineQuestion } from '~state'
import { Hypothesis, Experiment, Maybe } from '~types'

export function useBusinessLogic(): {
	defineQuestion: Experiment
	onInputChange: (value: Maybe<string>, type: string, field: string) => void
	setHypothesis: (e: any, option: Maybe<IChoiceGroupOption>) => void
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
	value: Maybe<string>,
	type: string,
	field: string,
) => void {
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()
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

function useSetHypothesis(): (
	e: any,
	option: Maybe<IChoiceGroupOption>,
) => void {
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()
	return useCallback(
		(e, option) => {
			if (option) {
				const newQuestion: Experiment = { ...defineQuestion }
				newQuestion.hypothesis = option.key as Hypothesis
				setDefineQuestion(newQuestion)
			}
		},
		[defineQuestion, setDefineQuestion],
	)
}
