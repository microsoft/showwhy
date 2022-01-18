/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { DescribeElements, ElementDefinition } from '~interfaces'
import { wait } from '~utils'

export function useSaveDefinitions(
	type: string,
	defineQuestion: DescribeElements,
	setDefineQuestion: (question: DescribeElements) => void,
): (definitions: ElementDefinition[]) => Promise<void> {
	return useCallback(
		async (definitions: ElementDefinition[]) => {
			const question: DescribeElements = {
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
