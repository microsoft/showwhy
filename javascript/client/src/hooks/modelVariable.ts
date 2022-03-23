/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	DefinitionType,
	ElementDefinition,
	Experiment,
} from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { useExperiment, useSetExperiment } from '~state/experiment'
import type { PageType } from '~types'
import { replaceItemAtIndex } from '~utils/arrays'

import { usePageType } from './usePageType'
// HACK to pass the unit tests

export function useSaveDefinition(
	experiment: Experiment,
	setExperiment: SetterOrUpdater<Experiment>,
): (newDefinition: CausalFactor, type: PageType | DefinitionType) => void {
	return useCallback(
		(newDefinition: CausalFactor, type: PageType | DefinitionType) => {
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
		[experiment, setExperiment],
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
			//TODO: REMOVE ALL TABLE TRANSFORM
			setDefineQuestion(newList)
		},
		[defineQuestion, type, setDefineQuestion],
	)
}
