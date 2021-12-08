/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { OnChange, OnRelevanceChangeArgs } from './interfaces'
import { ColumnRelation, ColumnRelevance } from '~enums'
import { TableColumn } from '~interfaces'
import { GenericFn } from '~types'

export const useOnRelevanceChange = ({
	setTableColumns,
	tableColumns,
	setRelevance,
	relevance,
	columnName,
	onRemoveColumn,
}: OnRelevanceChangeArgs): GenericFn => {
	return useCallback(
		(changedRelevance: ColumnRelevance | undefined) => {
			if (relevance === changedRelevance) {
				changedRelevance = undefined
			}

			setRelevance(changedRelevance)
			const column = {
				...tableColumns?.find(a => a.name === columnName),
				name: columnName,
				relevance: changedRelevance,
				relation: undefined,
			} as TableColumn

			if (changedRelevance === ColumnRelevance.SubjectIdentifier) {
				column.isDone = true
			} else {
				column.isDone = false
			}

			const newArray = [
				...(tableColumns?.filter(a => a.name !== columnName) || []),
			]
			newArray.push(column)
			setTableColumns(newArray)
			if (changedRelevance === ColumnRelevance.NotCausallyRelevant) {
				onRemoveColumn(columnName)
			}
		},
		[
			setTableColumns,
			tableColumns,
			setRelevance,
			relevance,
			columnName,
			onRemoveColumn,
		],
	)
}

export const useOnDefinitionChange = ({
	setTableColumns,
	tableColumns,
	columnName,
}: OnChange): GenericFn => {
	return useCallback(
		(changedRelation: ColumnRelation[]) => {
			const column = {
				...tableColumns?.find(a => a.name === columnName),
				name: columnName,
				relation: changedRelation,
				isDone: true,
				relevance: ColumnRelevance.CausallyRelevantToQuestion,
			} as TableColumn

			if (!changedRelation.length) {
				column.isDone = false
				column.relevance = undefined
			}

			const newArray = [
				...(tableColumns?.filter(a => a.name !== columnName) || []),
			]
			newArray.push(column)
			setTableColumns(newArray)
		},
		[setTableColumns, tableColumns, columnName],
	)
}

export const useToggleInvalidValue = ({
	setTableColumns,
	tableColumns,
	columnName,
}: OnChange): GenericFn => {
	return useCallback(
		value => {
			const actualColumn = tableColumns?.find(a => a.name === columnName) || {}

			const invalidV =
				tableColumns?.find(x => x.name === columnName)?.invalidValues ||
				([] as string[])
			const column = {
				...actualColumn,
				name: columnName,
			} as TableColumn

			const newValues = [...invalidV.filter(x => x !== value)]
			if (
				!invalidV?.includes(value) ||
				(value === null && invalidV?.includes('null'))
			) {
				if (value === null) {
					newValues.push('null')
				} else {
					newValues.push(value)
				}
			}
			column.invalidValues = newValues

			const newArray = [
				...(tableColumns?.filter(a => a.name !== columnName) || []),
			]
			newArray.push(column)
			return setTableColumns(newArray)
		},
		[tableColumns, columnName, setTableColumns],
	)
}
