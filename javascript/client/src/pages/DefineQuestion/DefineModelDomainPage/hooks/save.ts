/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import type { Experiment, ElementDefinition, AsyncHandler1 } from '~types'
import { wait } from '~utils'

export function useSaveDefinitions(
	type: string,
	defineQuestion: Experiment,
	setDefineQuestion: (question: Experiment) => void,
): AsyncHandler1<ElementDefinition[]> {
	return useCallback(
		async (definitions: ElementDefinition[]) => {
			const question: Experiment = {
				...defineQuestion,
				[type]: {
					...(defineQuestion as any)[type],
					definition: definitions,
				},
			}
			setDefineQuestion(question)
			await wait(500)
		},
		[setDefineQuestion, defineQuestion, type],
	)
}
