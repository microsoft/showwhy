/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ElementDefinition,
	Experiment,
	Maybe,
	Setter,
} from '@showwhy/types'
import { useEffect, useMemo, useState, useCallback } from 'react'

import { usePageType } from '~hooks'
import { useExperiment, useSetExperiment } from '~state'
import type { Item, PageType } from '~types'

import { useAddDefinition } from './add'
import { useEditDefinition } from './edit'
import { useRemoveDefinition } from './remove'
import { useSaveDefinitions } from './save'

export function useBusinessLogic(): {
	labelInterest: string
	descriptionInterest: string
	itemList: Item[]
	definitionToEdit: Maybe<ElementDefinition>
	pageType: PageType
	defineQuestion: Experiment
	addDefinition: (def: ElementDefinition) => void
	removeDefinition: (def: ElementDefinition) => void
	editDefinition: (def: ElementDefinition) => void
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>
	handleDefinitionTypeChange: (value: string) => void
} {
	const defineQuestion = useExperiment()
	const [definitionType, setDefinitionType] = useState<string>()
	const pageType = usePageType()
	const setDefineQuestion = useSetExperiment()
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()

	const def = useMemo(() => {
		console.log('Original defineQuestion', defineQuestion)
		const types = Object.keys(defineQuestion)
		let definitions: ElementDefinition[] = []
		types.forEach(type => {
			const def = defineQuestion[type]?.definition?.map(definition => ({
				...definition,
				type,
			}))
			if (def?.length) {
				definitions = [...definitions, ...def]
			}
		})
		console.log('Memoized definitions', definitions)
		return definitions
	}, [defineQuestion])

	// TODO: refactor this to output label for all types
	const labelInterest = useMemo<string>(() => {
		const types = Object.keys(defineQuestion)
		for (const type of types) {
			if (defineQuestion[type]?.label) {
				return defineQuestion[type].label
			}
		}
		return ''
	}, [defineQuestion])

	// TODO: refactor this to output description for all types
	const descriptionInterest = useMemo<string>(
		() => (defineQuestion as any)[pageType]?.description || '',
		[defineQuestion, pageType],
	)

	const saveDefinitions = useSaveDefinitions(
		definitionType,
		defineQuestion,
		setDefineQuestion,
	)

	const addDefinition = useAddDefinition(
		saveDefinitions,
		def.filter(x => x.type === definitionType),
	)

	const removeDefinition = useRemoveDefinition(
		saveDefinitions,
		def.filter(x => x.type === definitionType),
	)

	const editDefinition = useEditDefinition(
		setDefinitionToEdit,
		saveDefinitions,
		def.filter(x => x.type === definitionType),
	)

	const handleDefinitionTypeChange = useCallback(
		(val: string) => {
			setDefinitionType(val)
		},
		[setDefinitionType],
	)

	const itemList = useItemList(def)

	useEffect(() => {
		setDefinitionToEdit(undefined)
	}, [defineQuestion, definitionType, setDefinitionToEdit])

	return {
		labelInterest,
		descriptionInterest,
		itemList,
		definitionToEdit,
		pageType: definitionType,
		defineQuestion,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		handleDefinitionTypeChange,
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
