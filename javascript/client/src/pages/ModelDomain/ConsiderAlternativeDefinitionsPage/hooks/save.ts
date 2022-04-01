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
	pageType: string,
	defineQuestion: Experiment,
	setDefineQuestion: (question: Experiment) => void,
): AsyncHandler1<ElementDefinition[]> {
	return useCallback(
		async (definitions: ElementDefinition | ElementDefinition[]) => {
			// definitions = defineQuestion[pageType]?.definition || []
			if (!definitions) {
				return
			}
			let list = [...((defineQuestion as any)[pageType]?.definition || [])]
			if (!Array.isArray(definitions)) {
				list = [...list, withRandomId(definitions)]
			} else {
				list = [...definitions]
			}

			const question: Experiment = {
				...defineQuestion,
				[pageType]: {
					...(defineQuestion as any)[pageType],
					definition: list,
				},
			}
			console.log('Question to save', question)
			setDefineQuestion(question)
			await wait(500)
		},
		[setDefineQuestion, defineQuestion, pageType],
	)
}
