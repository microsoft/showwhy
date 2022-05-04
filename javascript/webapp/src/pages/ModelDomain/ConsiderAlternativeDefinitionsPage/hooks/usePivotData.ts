/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, Question } from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { useEffect, useMemo } from 'react'

import { useQuestion, useSetDefinitionType } from '~state'

import { useDefinitionToEdit } from '../ConsiderAlternativeDefinitions.state'
import { useSetPageDone } from '../ConsiderAlternativeDefinitionsPage.hooks'

interface PivotData {
	key: string
	title: string
	label: string
	description: string
	items: Record<string, any>[]
}

export function usePivotData(definitions: Definition[]): {
	pivotData: PivotData[]
} {
	const question = useQuestion()
	const [, setDefinitionToEdit] = useDefinitionToEdit()
	const pivotData: PivotData[] = useData(question, definitions)
	const setDefinitionType = useSetDefinitionType()

	useEffect(() => {
		setDefinitionType(DefinitionType.Population)
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [])

	useEffect(() => {
		setDefinitionToEdit(undefined)
	}, [definitions, setDefinitionToEdit])
	useSetPageDone()

	return {
		pivotData,
	}
}

function useItemList(definitions: Definition[] = []): Record<string, any>[] {
	return useMemo(() => {
		return definitions?.map(x => {
			const newObj = { ...x, dataPw: 'definition-element' }
			delete newObj.column
			return newObj
		})
	}, [definitions])
}

function useData(question: Question, definitions: Definition[]): PivotData[] {
	const itemList = useItemList(definitions)
	return useMemo(() => {
		const types = Object.keys(DefinitionType)
		const pivotData = types.reduce((acc: PivotData[], curr: string) => {
			const type = curr.toLowerCase()
			const { label = '', description = '' } = (question as any)[type] || {}
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
	}, [question, itemList])
}
