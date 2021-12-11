/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
// HACK to pass the unit tests
import { SetterOrUpdater } from 'recoil'
import { replaceItemAtIndex } from '../common/utils/functions'
import { usePageType } from './usePageType'
import { PageType } from '~enums'
import { DescribeElements, ElementDefinition } from '~interfaces'
import { useDefineQuestion, useSetDefineQuestion } from '~state'

export function useSaveDefinition(): (
	newDefinition: ElementDefinition,
) => void {
	return useSaveDefinitionTestable(
		usePageType(),
		useDefineQuestion(),
		useSetDefineQuestion(),
	)
}

export function useSaveDefinitionTestable(
	type: PageType,
	defineQuestion: DescribeElements,
	setDefineQuestion: SetterOrUpdater<DescribeElements>,
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

export function useRemoveDefinition(): (
	definitionToRemove: ElementDefinition,
) => void {
	return useRemoveDefinitionTestable(
		usePageType(),
		useDefineQuestion(),
		useSetDefineQuestion(),
	)
}

export function useRemoveDefinitionTestable(
	type: PageType,
	defineQuestion: DescribeElements,
	setDefineQuestion: SetterOrUpdater<DescribeElements>,
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
