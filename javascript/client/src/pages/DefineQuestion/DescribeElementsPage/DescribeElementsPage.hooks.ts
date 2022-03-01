/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Maybe, Hypothesis, Experiment } from '@showwhy/types'
import { useCallback } from 'react'
import { useExperiment, useSetExperiment } from '~state'

export function useBusinessLogic(): {
	defineQuestion: Experiment
	onInputChange: (value: Maybe<string>, type: string, field: string) => void
	setHypothesis: (e: any, option: Maybe<IChoiceGroupOption>) => void
} {
	const defineQuestion = useExperiment()
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

function useSetHypothesis(): (
	e: any,
	option: Maybe<IChoiceGroupOption>,
) => void {
	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	return useCallback(
		(_e, option) => {
			if (option) {
				const newQuestion: Experiment = { ...defineQuestion }
				newQuestion.hypothesis = option.key as Hypothesis
				setDefineQuestion(newQuestion)
			}
		},
		[defineQuestion, setDefineQuestion],
	)
}
