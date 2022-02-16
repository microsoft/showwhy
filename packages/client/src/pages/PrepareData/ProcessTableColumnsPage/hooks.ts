/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IColumn } from '@fluentui/react'
import { not } from 'arquero'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRestoreColumn, useTableCommands } from '~hooks'
import {
	useOriginalTables,
	useProjectFiles,
	useSelectedFile,
	useSetSelectedFile,
	useSetTableColumns,
	useTableColumns,
} from '~state'
import {
	ColumnRelevance,
	ColumnRelation,
	DataTable,
	ProjectFile,
	TableColumn,
	Setter,
	Maybe,
} from '~types'

export function useBusinessLogic(): {
	files: ProjectFile[]
	columns: IColumn[]
	selectedFile: Maybe<ProjectFile>
	selectedTable: Maybe<DataTable>
	selectedColumn: Maybe<string>
	onSelectColumn: (evt: any, column?: IColumn) => void
	tableCommands: ReturnType<typeof useTableCommands>
	relation: ColumnRelation[]
	relevance: Maybe<ColumnRelevance>
	isSubjectIdentifierAvailable: boolean
	onRelevanceChange: ReturnType<typeof useOnRelevanceChange>
	onDefinitionChange: ReturnType<typeof useOnDefinitionChange>
	restoreColumn: (value: string) => void
	onChangeFile: (file: ProjectFile) => void
} {
	const selectedFile = useSelectedFile()
	const setSelectedFile = useSetSelectedFile()
	const originalTables = useOriginalTables()
	const [selectedColumn, setSelectedColumn] = useState<string>()
	const [relevance, setRelevance] = useState<Maybe<ColumnRelevance>>()
	const tableColumns = useTableColumns(selectedFile?.id)
	const setTableColumns = useSetTableColumns(selectedFile?.id)
	const restoreColumn = useRestoreColumn(selectedFile?.id as string)
	const files = useProjectFiles()

	const isSubjectIdentifierAvailable = useMemo(
		() =>
			!tableColumns?.filter(
				x => x.relevance === ColumnRelevance.SubjectIdentifier,
			)?.length,
		[tableColumns],
	)

	const columnIsDone = useCallback(
		(column: string) => tableColumns?.find(x => x.name === column)?.isDone,
		[tableColumns],
	)

	const removedColumns = useMemo((): string[] => {
		return (
			tableColumns
				?.filter(x => x.relevance === ColumnRelevance.NotCausallyRelevant)
				.map(x => x.name) || []
		)
	}, [tableColumns])

	const selectedTable = useMemo(() => {
		return originalTables.find(x => x.tableId === selectedFile?.id)
	}, [originalTables, selectedFile])

	const columns = useMemo((): IColumn[] => {
		if (!selectedTable) return []
		return selectedTable.table
			?.select(not(removedColumns))
			.columnNames()
			.map(column => {
				return {
					key: column,
					name: column,
					iconName: columnIsDone(column) ? 'Accept' : 'Help',
					fieldName: column,
				} as IColumn
			})
	}, [selectedTable, removedColumns, columnIsDone])

	const selectFirstColumn = useCallback(() => {
		setSelectedColumn(
			selectedTable?.table?.select(not(removedColumns)).columnNames()[0],
		)
	}, [removedColumns, setSelectedColumn, selectedTable])

	useEffect(() => {
		if (selectedColumn) return
		selectFirstColumn()
	}, [selectFirstColumn, selectedColumn])

	useEffect(() => {
		const newRelevance = tableColumns?.find(
			x => x.name === selectedColumn,
		)?.relevance
		setRelevance(newRelevance)
	}, [selectedColumn, tableColumns, setRelevance])

	const onChangeFile = useCallback(
		(projectFile: ProjectFile) => {
			setSelectedFile(projectFile)
			setSelectedColumn(
				selectedTable?.table?.select(not(removedColumns)).columnNames()[0],
			)
		},
		[setSelectedFile, selectedTable, removedColumns],
	)

	const onSelectColumn = useCallback(
		(evt: any, column?: IColumn) => {
			setSelectedColumn(column?.name)
		},
		[setSelectedColumn],
	)

	const relation = useMemo(
		() => tableColumns?.find(x => x.name === selectedColumn)?.relation || [],
		[tableColumns, selectedColumn],
	)

	const tableCommands = useTableCommands(
		selectedTable,
		columns,
		restoreColumn,
		column => onRelevanceChange(ColumnRelevance.NotCausallyRelevant, column),
	)

	const onRelevanceChange = useOnRelevanceChange({
		setTableColumns,
		tableColumns,
		setRelevance,
		relevance,
		onRemoveColumn: onSelectColumn,
	})

	const onDefinitionChange = useOnDefinitionChange({
		setTableColumns,
		tableColumns,
	})

	return {
		files,
		columns,
		selectedFile,
		selectedTable,
		onChangeFile,
		restoreColumn,
		selectedColumn,
		onSelectColumn,
		tableCommands,
		relation,
		isSubjectIdentifierAvailable,
		onRelevanceChange,
		onDefinitionChange,
		relevance,
	}
}

export function useOnRelevanceChange({
	setTableColumns,
	tableColumns,
	setRelevance,
	relevance,
	onRemoveColumn,
}: {
	setTableColumns: Setter<Maybe<TableColumn[]>>
	tableColumns?: TableColumn[]
	setRelevance: Setter<Maybe<ColumnRelevance>>
	relevance?: ColumnRelevance
	onRemoveColumn: (columnName?: string) => void
}): (changedRelevance: Maybe<ColumnRelevance>, columnName?: string) => void {
	return useCallback(
		(changedRelevance: Maybe<ColumnRelevance>, columnName?: string) => {
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
				onRemoveColumn(undefined)
			}
		},
		[setTableColumns, tableColumns, setRelevance, relevance, onRemoveColumn],
	)
}

export function useOnDefinitionChange({
	setTableColumns,
	tableColumns,
}: {
	setTableColumns: Setter<Maybe<TableColumn[]>>
	tableColumns?: TableColumn[]
}): (changedRelation: ColumnRelation[], columnName?: string) => void {
	return useCallback(
		(changedRelation: ColumnRelation[], columnName?: string) => {
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
		[setTableColumns, tableColumns],
	)
}
