/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IComboBoxOption } from '@fluentui/react'
import { useEffect, useMemo, useState } from 'react'
import { useAddDefinition } from './add'
import { useEditDefinition } from './edit'
import { useRemoveDefinition } from './remove'
import { useSaveDefinitions } from './save'
import { PageType } from '~enums'
import { usePageType, useVariableOptions } from '~hooks'
import { Experiment, ElementDefinition, Item, Setter } from '~interfaces'
import { useDefineQuestion, useSetDefineQuestion } from '~state'

export function useBusinessLogic(): {
	labelInterest: string
	descriptionInterest: string
	itemList: Item[]
	definitionToEdit: ElementDefinition | undefined
	pageType: PageType
	defineQuestion: Experiment
	variables: IComboBoxOption[]
	addDefinition: (def: ElementDefinition) => void
	removeDefinition: (def: ElementDefinition) => void
	editDefinition: (def: ElementDefinition) => void
	setDefinitionToEdit: Setter<ElementDefinition | undefined>
} {
	const defineQuestion = useDefineQuestion()
	const pageType = usePageType()
	const variables = useVariableOptions()
	const setDefineQuestion = useSetDefineQuestion()
	const [definitions, setDefinitions] = useState<ElementDefinition[]>(
		defineQuestion[pageType]?.definition || [],
	)
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()

	const labelInterest = useMemo<string>(
		() => defineQuestion[pageType]?.label || '',
		[defineQuestion, pageType],
	)

	const descriptionInterest = useMemo<string>(
		() => defineQuestion[pageType]?.description || '',
		[defineQuestion, pageType],
	)

	const saveDefinitions = useSaveDefinitions(
		pageType,
		defineQuestion,
		setDefineQuestion,
	)

	const addDefinition = useAddDefinition(
		setDefinitions,
		saveDefinitions,
		definitions,
	)

	const removeDefinition = useRemoveDefinition(
		setDefinitions,
		saveDefinitions,
		definitions,
	)

	const editDefinition = useEditDefinition(
		setDefinitions,
		setDefinitionToEdit,
		saveDefinitions,
	)

	const itemList = useItemList(definitions)

	useEffect(() => {
		setDefinitions(defineQuestion[pageType]?.definition || [])
		setDefinitionToEdit(undefined)
	}, [defineQuestion, pageType, setDefinitionToEdit, setDefinitions])

	return {
		labelInterest,
		descriptionInterest,
		itemList,
		definitionToEdit,
		pageType,
		defineQuestion,
		variables,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
	}
}

function useItemList(definitions): Item[] {
	return useMemo(() => {
		return definitions?.map(x => {
			const newObj = { ...x }
			delete newObj.column
			return newObj
		})
	}, [definitions])
}
