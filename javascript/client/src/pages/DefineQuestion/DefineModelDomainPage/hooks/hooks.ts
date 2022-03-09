/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IComboBoxOption } from '@fluentui/react'
import type {
	ElementDefinition,
	Experiment,
	Maybe,
	Setter,
} from '@showwhy/types'
import { useEffect, useMemo, useState } from 'react'

import { usePageType, useVariableOptions } from '~hooks'
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
	variables: IComboBoxOption[]
	addDefinition: (def: ElementDefinition) => void
	removeDefinition: (def: ElementDefinition) => void
	editDefinition: (def: ElementDefinition) => void
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>
} {
	const defineQuestion = useExperiment()
	const pageType = usePageType()
	const variables = useVariableOptions()
	const setDefineQuestion = useSetExperiment()
	const [definitions, setDefinitions] = useState<ElementDefinition[]>(
		(defineQuestion as any)[pageType]?.definition || [],
	)
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()

	const labelInterest = useMemo<string>(
		() => (defineQuestion as any)[pageType]?.label || '',
		[defineQuestion, pageType],
	)

	const descriptionInterest = useMemo<string>(
		() => (defineQuestion as any)[pageType]?.description || '',
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
		setDefinitions((defineQuestion as any)[pageType]?.definition || [])
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

function useItemList(definitions: ElementDefinition[]): Item[] {
	return useMemo(() => {
		return definitions?.map(x => {
			const newObj = { ...x, dataPw: 'definition-element' }
			delete newObj.column
			return newObj
		})
	}, [definitions])
}
