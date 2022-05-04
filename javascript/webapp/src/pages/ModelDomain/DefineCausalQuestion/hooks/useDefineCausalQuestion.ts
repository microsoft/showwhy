/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Maybe, Question } from '@showwhy/types'

import { useQuestion } from '~state'

import {
	useOnInputChange,
	useSetHypothesis,
	useSetPageDone,
} from '../DefineCausalQuestion.hooks'

export function useDefineCausalQuestion(): {
	question: Question
	onInputChange: (value: Maybe<string>, type: string, field: string) => void
	setHypothesis: (e: any, option: Maybe<IChoiceGroupOption>) => void
} {
	const question = useQuestion()
	const onInputChange = useOnInputChange()
	const setHypothesis = useSetHypothesis()
	useSetPageDone()

	return {
		question,
		onInputChange,
		setHypothesis,
	}
}
