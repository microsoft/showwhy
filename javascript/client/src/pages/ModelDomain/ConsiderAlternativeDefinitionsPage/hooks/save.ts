/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	AsyncHandler1,
	ElementDefinition,
	Experiment,
} from '@showwhy/types'
import { useCallback } from 'react'

import { wait, withRandomId } from '~utils'

export function useSaveDefinitions(
	defineQuestion: Experiment,
	setDefineQuestion: (question: Experiment) => void,
): AsyncHandler1<ElementDefinition[]> {
	return useCallback(
		async (definitions: ElementDefinition | ElementDefinition[]) => {
			if (!definitions) {
				return
			}
			let list = [...((defineQuestion as any)?.definitions || [])]
			if (!Array.isArray(definitions)) {
				list = [...list, withRandomId(definitions)]
			} else {
				list = [...definitions]
			}

			const question: Experiment = {
				...defineQuestion,
				definitions: list,
			}
			setDefineQuestion(question)
			await wait(500)
		},
		[setDefineQuestion, defineQuestion],
	)
}
