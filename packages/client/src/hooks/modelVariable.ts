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

export function useSaveDefinition(
	defineQuestion: Experiment,
	setDefineQuestion: SetterOrUpdater<Experiment>,
): (newDefinition: CausalFactor, type: PageType) => void {
	return useCallback(
		(newDefinition: CausalFactor, type: PageType) => {
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
		[defineQuestion, setDefineQuestion],
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
