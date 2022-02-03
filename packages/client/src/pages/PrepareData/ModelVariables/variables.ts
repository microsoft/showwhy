/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IContextualMenuItem } from '@fluentui/react'
import { useMemo } from 'react'
import {
	SelectedArgs,
	SubjectIdentifierArgs,
	SubjectIdentifierDataArgs,
} from './interfaces'
import { PageType, DataTable, CausalFactor, ColumnRelevance } from '~types'

export function useSelected({
	defineQuestionData,
	definitionOptions,
	selectedDefinition,
	type,
	causalFactors,
}: SelectedArgs): string {
	return useMemo((): string => {
		let options = defineQuestionData?.definition?.flatMap(x => x.variable) || []
		if (type === PageType.Control) {
			options = causalFactors.flatMap(x => x.variable)
		}
		if (!selectedDefinition.length || !options.includes(selectedDefinition)) {
			return definitionOptions[0]?.variable as string
		}
		return selectedDefinition
	}, [
		defineQuestionData,
		definitionOptions,
		selectedDefinition,
		type,
		causalFactors,
	])
}

export function useSubjectIdentifier({
	allTableColumns,
	modelVariables,
}: SubjectIdentifierArgs): string[] {
	return useMemo(() => {
		const projectTableColumns = allTableColumns.flatMap(x => x)
		const columns =
			modelVariables.length > 0
				? (modelVariables
						.flat()
						.flatMap(a => a?.filters)
						.filter(x => x)
						.map(a => a?.columnName) as string[])
				: []

		return (
			projectTableColumns
				?.filter(
					c =>
						c?.relevance === ColumnRelevance.SubjectIdentifier ||
						columns.includes(c?.name as string),
				)
				.map(x => x?.name || '')
				.concat(columns) || []
		)
	}, [allTableColumns, modelVariables])
}

export function useSubjectIdentifierData({
	allOriginalTables,
	subjectIdentifier,
	setTableIdentifier,
}: SubjectIdentifierDataArgs): DataTable {
	return useMemo((): DataTable => {
		const mainTable = allOriginalTables
			.map(originalTable => {
				const basicTable = { ...originalTable }
				const columns = subjectIdentifier.filter(x =>
					basicTable?.table.columnNames().includes(x),
				)

				if (!columns.length) return null
				basicTable.table = basicTable.table.select(columns)

				return basicTable as DataTable
			})
			.find(x => x)

		const columnNames = mainTable?.table?.columnNames()
		const data = {
			columnNames,
			table: mainTable?.table,
			tableId: mainTable?.tableId,
		} as DataTable
		setTableIdentifier(data)
		return data
	}, [allOriginalTables, subjectIdentifier, setTableIdentifier])
}

export function useColumnsAsTarget({
	subjectIdentifierData,
	causalFactors,
	type,
	onUpdateTargetVariable,
}: {
	subjectIdentifierData: DataTable
	causalFactors: CausalFactor[]
	type: string
	onUpdateTargetVariable: (_evt: unknown, value: any) => void
}): IContextualMenuItem[] {
	const selectedColumns = useMemo<string[]>(() => {
		return type === PageType.Control
			? causalFactors.map(x => x.column as string).filter(f => !!f)
			: []
	}, [type, causalFactors])

	return useMemo<IContextualMenuItem[]>(() => {
		if (!subjectIdentifierData?.columnNames) {
			return []
		}
		return subjectIdentifierData.columnNames
			.filter(x => !selectedColumns.includes(x))
			.map(opt => {
				return {
					key: opt,
					text: opt,
					canCheck: true,
					onClick: onUpdateTargetVariable,
				} as IContextualMenuItem
			})
	}, [subjectIdentifierData, onUpdateTargetVariable, selectedColumns])
}
