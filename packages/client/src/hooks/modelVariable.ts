/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetterOrUpdater } from 'recoil'
import { usePageType } from './usePageType'
import { useExperiment, useSetExperiment } from '~state/experiment'
import { PageType, Experiment, ElementDefinition, CausalFactor } from '~types'
import { replaceItemAtIndex } from '~utils/arrays'
// HACK to pass the unit tests

export function useSaveDefinition(): (newDefinition: CausalFactor) => void {
	return useSaveDefinitionTestable(
		usePageType(),
		useExperiment(),
		useSetExperiment(),
	)
}

export function useSaveDefinitionTestable(
	type: PageType,
	defineQuestion: Experiment,
	setDefineQuestion: SetterOrUpdater<Experiment>,
): (newDefinition: CausalFactor) => void {
	return useCallback(
		(newDefinition: CausalFactor) => {
			let newDefinitionList =
				[...(defineQuestion as any)[type]?.definition] || []

			const index = (defineQuestion as any)[type]?.definition?.findIndex(
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
					...(defineQuestion as any)[type],
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
		useSetExperiment(),
	)
}

export function useRemoveDefinitionTestable(
	type: PageType,
	defineQuestion: Experiment,
	setDefineQuestion: SetterOrUpdater<Experiment>,
): (definitionToRemove: ElementDefinition) => void {
	return useCallback(
		(definitionToRemove: ElementDefinition) => {
			const newDefinitionList = [
				...(defineQuestion as any)[type].definition,
			].filter(x => x.id !== definitionToRemove.id)
			const newList = {
				...defineQuestion,
				[type]: {
					...(defineQuestion as any)[type],
					definition: newDefinitionList,
				},
			}
			setDefineQuestion(newList)
		},
		[defineQuestion, type, setDefineQuestion],
	)
}
