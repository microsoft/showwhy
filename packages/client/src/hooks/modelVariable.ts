/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { usePageType } from './usePageType'
import { ElementDefinition } from '~interfaces'
import { useDefineQuestion, useSetDefineQuestion } from '~state'
import { replaceItemAtIndex } from '~utils'

export function useSaveDefinition(): (
	newDefinition: ElementDefinition,
) => void {
	const type = usePageType()
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()

	return useCallback(
		(newDefinition: ElementDefinition) => {
			let newDefinitionList = [...defineQuestion[type]?.definition] || []

			const index = defineQuestion[type]?.definition?.findIndex(
				(x: ElementDefinition) => x.id === newDefinition?.id,
			)
			if (index > -1) {
				newDefinitionList = replaceItemAtIndex(
					newDefinitionList,
					index,
					newDefinition,
				)
			} else {
				newDefinitionList.push(newDefinition)
			}
			const newList = {
				...defineQuestion,
				[type]: {
					...defineQuestion[type],
					definition: newDefinitionList,
				},
			}
			setDefineQuestion(newList)
		},
		[defineQuestion, type, setDefineQuestion],
	)
}
export function useRemoveDefinition(): (
	definitionToRemove: ElementDefinition,
) => void {
	const type = usePageType()
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()

	return useCallback(
		(definitionToRemove: ElementDefinition) => {
			const newDefinitionList = [...defineQuestion[type].definition].filter(
				x => x.id !== definitionToRemove.id,
			)
			const newList = {
				...defineQuestion,
				[type]: {
					...defineQuestion[type],
					definition: newDefinitionList,
				},
			}
			setDefineQuestion(newList)
		},
		[defineQuestion, type, setDefineQuestion],
	)
}
