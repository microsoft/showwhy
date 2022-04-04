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
import { DefinitionType } from '@showwhy/types'
import { useEffect, useMemo, useState } from 'react'

import { useAddOnLeavePage } from '~hooks'
import { useExperiment, useSetExperiment } from '~state'
import type { Item } from '~types'

import { useAddDefinition } from './add'
import { useEditDefinition } from './edit'
import { useRemoveDefinition } from './remove'
import { useSaveDefinitions } from './save'

interface PivotData {
	title: string
	label: string
	description: string
}

export function useBusinessLogic(): {
	itemList: Item[]
	definitionToEdit: Maybe<ElementDefinition>
	type?: DefinitionType
	defineQuestion: Experiment
	pivotData: PivotData[]
	addDefinition: (def: ElementDefinition) => void
	removeDefinition: (def: ElementDefinition) => void
	editDefinition: (def: ElementDefinition) => void
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>
	setDefinition: (def: Partial<ElementDefinition>) => void
} {
	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()
	const [definition, setDefinition] = useState<Partial<ElementDefinition>>()

	const definitions = useMemo(() => {
		return defineQuestion.definitions || []
	}, [defineQuestion])

	const pivotData: PivotData[] = usePivotData(defineQuestion)

	const saveDefinitions = useSaveDefinitions(defineQuestion, setDefineQuestion)

	const addDefinition = useAddDefinition(saveDefinitions, definitions)

	const removeDefinition = useRemoveDefinition(saveDefinitions, definitions)

	const editDefinition = useEditDefinition(saveDefinitions, definitions)

	const itemList = useItemList(definitions)

	useEffect(() => {
		setDefinitionToEdit(undefined)
	}, [defineQuestion, setDefinitionToEdit])
	useAddOnLeavePage<ElementDefinition>(definition as ElementDefinition, addDefinition)

	return {
		itemList,
		definitionToEdit,
		type: definition?.type,
		defineQuestion,
		pivotData,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		setDefinition
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

function usePivotData(defineQuestion: Experiment): PivotData[] {
	return useMemo(() => {
		const types = Object.keys(DefinitionType)
		const pivotData = types.reduce((acc: PivotData[], curr: string) => {
			const type = curr.toLowerCase()
			if (defineQuestion.hasOwnProperty(type)) {
				const { label = '', description = '' } = (defineQuestion as any)[type]
				return [...acc, {title: curr, label, description }]
			}
			return acc
		}, [])
		return pivotData
	}, [defineQuestion])
}
