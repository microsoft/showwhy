/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Hypothesis, Maybe, Question } from '@showwhy/types'
import { useCallback } from 'react'

import { useQuestion, useSetQuestion } from '~state'

export function useSetHypothesis(): (
	e: any,
	option: Maybe<IChoiceGroupOption>,
) => void {
	const question = useQuestion()
	const setQuestion = useSetQuestion()
	return useCallback(
		(_e, option) => {
			if (option) {
				const newQuestion: Question = { ...question }
				newQuestion.hypothesis = option.key as Hypothesis
				setQuestion(newQuestion)
			}
		},
		[question, setQuestion],
	)
}
