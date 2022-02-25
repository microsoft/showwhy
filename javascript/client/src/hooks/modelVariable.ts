/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { usePageType } from './usePageType'
import { useExperiment, useSetExperiment } from '~state/experiment'
import type {
	PageType,
	Experiment,
	ElementDefinition,
	CausalFactor,
} from '~types'
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
	experiment: Experiment,
	setExperiment: SetterOrUpdater<Experiment>,
): (newDefinition: CausalFactor) => void {
	return useCallback(
		(newDefinition: CausalFactor) => {
			let newDefinitionList = [...(experiment as any)[type]?.definition] || []

			const index = (experiment as any)[type]?.definition?.findIndex(
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
				...experiment,
				[type]: {
					...(experiment as any)[type],
					definition: newDefinitionList,
				},
			}
			setExperiment(newList)
		},
		[experiment, type, setExperiment],
	)
}

export function useRemoveDefinition(): (
	definitionToRemove: ElementDefinition,
) => void {
	return useRemoveDefinitionTestable(
		usePageType(),
		useExperiment(),
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
