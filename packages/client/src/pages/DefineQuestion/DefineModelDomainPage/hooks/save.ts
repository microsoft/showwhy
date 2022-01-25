/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { Experiment, ElementDefinition } from '~types'
import { wait } from '~utils'

export function useSaveDefinitions(
	type: string,
	defineQuestion: Experiment,
	setDefineQuestion: (question: Experiment) => void,
): (definitions: ElementDefinition[]) => Promise<void> {
	return useCallback(
		async (definitions: ElementDefinition[]) => {
			const question: Experiment = {
				...defineQuestion,
				[type]: {
					...defineQuestion[type],
					definition: definitions,
				},
			}
			setDefineQuestion(question)
			await wait(500)
		},
		[setDefineQuestion, defineQuestion, type],
	)
}
