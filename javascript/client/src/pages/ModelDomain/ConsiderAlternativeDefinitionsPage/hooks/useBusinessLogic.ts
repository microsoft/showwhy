/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Item } from '@showwhy/components'
import type {
	ElementDefinition,
	Experiment,
	Maybe,
	Setter,
} from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { useEffect, useMemo, useState } from 'react'

import { useHandleOnLinkClick } from '~hooks'
import { useDefinitionType, useExperiment } from '~state'

import {
	useAddDefinition,
	useEditDefinition,
	useRemoveDefinition,
	useSetPageDone,
} from '../ConsiderAlternativeDefinitionsPage.hooks'

interface PivotData {
	key: string
	title: string
	label: string
	description: string
	items: Item[]
}

export function useBusinessLogic(): {
	definitionToEdit: Maybe<ElementDefinition>
	defineQuestion: Experiment
	pivotData: PivotData[]
	addDefinition: (def: ElementDefinition) => void
	removeDefinition: (def: ElementDefinition) => void
	editDefinition: (def: ElementDefinition) => void
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>
	definitionType: DefinitionType
	handleOnLinkClick: (item: any) => void
} {
	const defineQuestion = useExperiment()
	const definitionType = useDefinitionType()
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()

	const definitions = useMemo(() => {
		return defineQuestion.definitions || []
	}, [defineQuestion])

	const pivotData: PivotData[] = usePivotData(defineQuestion)

	const addDefinition = useAddDefinition()

	const removeDefinition = useRemoveDefinition(definitions)

	const editDefinition = useEditDefinition(definitions)

	const handleOnLinkClick = useHandleOnLinkClick()

	useEffect(() => {
		setDefinitionToEdit(undefined)
	}, [defineQuestion, setDefinitionToEdit])
	useSetPageDone()

	return {
		definitionToEdit,
		defineQuestion,
		pivotData,
		definitionType,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		handleOnLinkClick,
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
	const itemList = useItemList(defineQuestion?.definitions)
	return useMemo(() => {
		const types = Object.keys(DefinitionType).filter(
			k => !k.includes('Cause') && !k.includes('Confounders'),
		)
		const pivotData = types.reduce((acc: PivotData[], curr: string) => {
			const type = curr.toLowerCase()
			const { label = '', description = '' } =
				(defineQuestion as any)[type] || {}
			acc = [
				...acc,
				{
					title: curr,
					label,
					description,
					key: type,
					items: itemList.filter(i => i['type'] === type),
				},
			]
			return acc
		}, [])
		return pivotData
	}, [defineQuestion, itemList])
}
