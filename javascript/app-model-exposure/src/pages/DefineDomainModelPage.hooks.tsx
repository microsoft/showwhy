/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Hypothesis } from '@showwhy/app-common'
import { useDebounceFn } from 'ahooks'
import { type FormEvent, useCallback } from 'react'
import { v4 as uuiv4 } from 'uuid'

import { useSetCausalQuestion } from '../state/causalQuestion.js'
import { useDefinitionsState } from '../state/definitions.js'
import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Maybe } from '../types/primitives.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { CausalQuestionElement } from '../types/question/CausalQuestionElement.js'

function useAddDefaultDefinition() {
	const [definitions, setDefinitions] = useDefinitionsState()
	return useDebounceFn(
		(type: DefinitionType, value: string) => {
			const hasDefinition = !!definitions.find(d => d.type === type)
			if (!hasDefinition) {
				const variable = value.toLowerCase().replaceAll(' ', '_')
				setDefinitions(prev => [
					...prev,
					{
						type,
						variable,
						id: uuiv4(),
						default: true,
						description: '',
						level: CausalityLevel.Primary,
					},
				])
			}
		},
		{ wait: 1000 },
	)
}

export function useOnInputChange(
	causalQuestion: CausalQuestion,
): (value: Maybe<string>, type: string, field: string) => void {
	const setCausalQuestion = useSetCausalQuestion()
	const addDefaultDefinition = useAddDefaultDefinition()

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
			addDefaultDefinition.run(type as DefinitionType, value)
		},
		[causalQuestion, setCausalQuestion, addDefaultDefinition],
	)
}

export function useOnHypothesisChange(
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
