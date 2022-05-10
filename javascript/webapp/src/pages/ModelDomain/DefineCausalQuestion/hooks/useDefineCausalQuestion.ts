/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe, Question } from '@showwhy/types'

import { useQuestion } from '~state'

import { useOnInputChange } from './useOnInputChange'
import { useSetPageDone } from './useSetPageDone'

export function useDefineCausalQuestion(): {
	question: Question
	onInputChange: (value: Maybe<string>, type: string, field: string) => void
} {
	const question = useQuestion()
	const onInputChange = useOnInputChange()
	useSetPageDone()

	return {
		question,
		onInputChange,
	}
}
