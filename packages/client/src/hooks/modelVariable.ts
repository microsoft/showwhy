/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
// HACK to pass the unit tests
import { replaceItemAtIndex } from '../common/utils/functions'
import { usePageType } from './usePageType'
import { ElementDefinition } from '~interfaces'
import { useDefineQuestion, useSetDefineQuestion } from '~state'

export function useSaveDefinition(
	type = usePageType(),
	defineQuestion = useDefineQuestion(),
	setDefineQuestion = useSetDefineQuestion(),
): (newDefinition: ElementDefinition) => void {
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
export function useRemoveDefinition(
	type = usePageType(),
	defineQuestion = useDefineQuestion(),
	setDefineQuestion = useSetDefineQuestion(),
): (definitionToRemove: ElementDefinition) => void {
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
