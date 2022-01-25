/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetterOrUpdater } from 'recoil'
import { usePageType } from './usePageType'
import { useDefineQuestion, useSetDefineQuestion } from '~state/defineQuestion'
import { PageType, Experiment, ElementDefinition, CausalFactor } from '~types'
import { replaceItemAtIndex } from '~utils/functions'
// HACK to pass the unit tests

export function useSaveDefinition(): (newDefinition: CausalFactor) => void {
	return useSaveDefinitionTestable(
		usePageType(),
		useDefineQuestion(),
		useSetDefineQuestion(),
	)
}

export function useSaveDefinitionTestable(
	type: PageType,
	defineQuestion: Experiment,
	setDefineQuestion: SetterOrUpdater<Experiment>,
): (newDefinition: CausalFactor) => void {
	return useCallback(
		(newDefinition: CausalFactor) => {
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
	defineQuestion: Experiment,
	setDefineQuestion: SetterOrUpdater<Experiment>,
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
