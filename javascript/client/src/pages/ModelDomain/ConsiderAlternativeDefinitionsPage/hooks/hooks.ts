/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	DefinitionType,
	ElementDefinition,
	Experiment,
	Maybe,
	Setter,
} from '@showwhy/types'
import { useEffect, useMemo, useState } from 'react'

import { usePageType } from '~hooks'
import { useExperiment, useSetExperiment } from '~state'
import type { Item } from '~types'

import { useAddDefinition } from './add'
import { useEditDefinition } from './edit'
import { useRemoveDefinition } from './remove'
import { useSaveDefinitions } from './save'

export function useBusinessLogic(): {
	labelInterest: string
	descriptionInterest: string
	itemList: Item[]
	definitionToEdit: Maybe<ElementDefinition>
	type?: DefinitionType
	defineQuestion: Experiment
	addDefinition: (def: ElementDefinition) => void
	removeDefinition: (def: ElementDefinition) => void
	editDefinition: (def: ElementDefinition) => void
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>
	setDefinitionType: (value: DefinitionType) => void
} {
	const defineQuestion = useExperiment()
	const [definitionType, setDefinitionType] = useState<DefinitionType>()
	const pageType = usePageType()
	const setDefineQuestion = useSetExperiment()
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()

	const definitions = useMemo(() => {
		console.log('Original defineQuestion', defineQuestion)
		console.log('Memoized definitions', defineQuestion.definitions)
		return defineQuestion.definitions || []
	}, [defineQuestion])

	// TODO: refactor this to output label for all types
	const labelInterest = useMemo<string>(() => {
		const types = Object.keys(defineQuestion)
		for (const type of types) {
			if ((defineQuestion as any)[type]?.label) {
				return (defineQuestion as any)[type].label
			}
		}
		return ''
	}, [defineQuestion])

	// TODO: refactor this to output description for all types
	const descriptionInterest = useMemo<string>(
		() => (defineQuestion as any)[pageType]?.description || '',
		[defineQuestion, pageType],
	)

	const saveDefinitions = useSaveDefinitions(defineQuestion, setDefineQuestion)

	const addDefinition = useAddDefinition(saveDefinitions, definitions)

	const removeDefinition = useRemoveDefinition(saveDefinitions, definitions)

	const editDefinition = useEditDefinition(saveDefinitions, definitions)

	const itemList = useItemList(definitions)

	useEffect(() => {
		setDefinitionToEdit(undefined)
	}, [defineQuestion, definitionType, setDefinitionToEdit])

	return {
		labelInterest,
		descriptionInterest,
		itemList,
		definitionToEdit,
		type: definitionType,
		defineQuestion,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		setDefinitionType,
	}
}

function useItemList(definitions: ElementDefinition[] = []): Item[] {
	return useMemo(() => {
		return definitions?.map(x => {
			const newObj = { ...x, dataPw: 'definition-element' }
			delete newObj.column
			return newObj
		})
	}, [definitions])
}
