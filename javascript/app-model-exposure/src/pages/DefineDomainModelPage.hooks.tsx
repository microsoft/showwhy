/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Hypothesis } from '@showwhy/app-common'
import { type FormEvent, useCallback } from 'react'

import { useSetCausalQuestion } from '../state/causalQuestion.js'
import type { Maybe } from '../types/primitives.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { CausalQuestionElement } from '../types/question/CausalQuestionElement.js'

export function useOnInputChange(
	causalQuestion: CausalQuestion,
): (value: Maybe<string>, type: string, field: string) => void {
	const setCausalQuestion = useSetCausalQuestion()

	return useCallback(
		(value, type, field) => {
			const typeKey = type as keyof CausalQuestion
			const actual = causalQuestion[typeKey] as CausalQuestionElement
			const newValues = {
				...actual,
				[field]: value,
			} as CausalQuestionElement

			const newElements = { ...causalQuestion }
			//eslint-disable-next-line
			;(newElements as any)[type] = newValues
			setCausalQuestion(newElements)
		},
		[causalQuestion, setCausalQuestion],
	)
}

export function useOnHypothesysChange(
	causalQuestion: CausalQuestion,
): (
	_?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
	option?: IChoiceGroupOption | undefined,
) => void {
	const setCausalQuestion = useSetCausalQuestion()

	return useCallback(
		(_, option) => {
			if (option) {
				const newQuestion: CausalQuestion = { ...causalQuestion }
				newQuestion.hypothesis = option.key as Hypothesis
				setCausalQuestion(newQuestion)
			}
		},
		[causalQuestion, setCausalQuestion],
	)
}
