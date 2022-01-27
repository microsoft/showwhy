/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createDefaultCommandBar } from '@data-wrangling-components/react'
import {
	IColumn,
	ICommandBarItemProps,
	IDetailsColumnProps,
	IRenderFunction,
} from '@fluentui/react'
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
	DataTable,
	ProjectFile,
	TableColumn,
	Setter,
} from '~types'

export function useBusinessLogic(): {
	files: ProjectFile[]
	columns: IColumn[]
	selectedFile: ProjectFile | undefined
	selectedTable: DataTable | undefined
	selectedColumn: string | undefined
	onSelectColumn: (evt: any, column?: IColumn) => void
	tableCommands: ReturnType<typeof useTableCommands>
	restoreColumn: (value: string) => void
	onChangeFile: (file: ProjectFile) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
} {
	const selectedFile = useSelectedFile()
	const setSelectedFile = useSetSelectedFile()
	const originalTables = useOriginalTables()
	const [selectedColumn, setSelectedColumn] = useState<string>()
	const [relevance, setRelevance] = useState<ColumnRelevance | undefined>()
	const tableColumns = useTableColumns(selectedFile?.id)
	const setTableColumns = useSetTableColumns(selectedFile?.id)
	const restoreColumn = useRestoreColumn(selectedFile?.id as string)
	const files = useProjectFiles()

	const columnIsDone = useCallback(
		(column: string) => tableColumns?.find(x => x.name === column)?.isDone,
		[tableColumns],
	)

	const subjectIdentifier = useMemo(
		(): TableColumn | undefined =>
			tableColumns?.find(
				x => x.relevance === ColumnRelevance.SubjectIdentifier,
			),
		[tableColumns],
	)

	const removedColumns = useMemo((): string[] => {
		return (
			tableColumns
				?.filter(x => x.relevance === ColumnRelevance.NotRelevant)
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

	useEffect(() => {
		setSelectedFile(files[0])
	}, [files, setSelectedFile])

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
			setSelectedColumn(column?.name || undefined)
		},
		[setSelectedColumn],
	)

	const tableCommands = useTableCommands(
		selectedTable,
		columns,
		restoreColumn,
		column => onRelevanceChange(ColumnRelevance.NotRelevant, column),
	)

	const onRelevanceChange = useOnRelevanceChange({
		setTableColumns,
		tableColumns,
		setRelevance,
		relevance,
		onRemoveColumn: onSelectColumn,
	})

	const commandBar = useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name
			const items: ICommandBarItemProps[] = [
				{
					key: 'newItem',
					text: 'Set as subject identifier',
					iconOnly: true,
					iconProps: { iconName: 'Permissions' },
					toggle: true,
					disabled: subjectIdentifier && subjectIdentifier?.name !== columnName,
					checked: subjectIdentifier?.name === columnName,
					onClick: () =>
						onRelevanceChange(ColumnRelevance.SubjectIdentifier, columnName),
				},
				{
					key: 'deleteItem',
					text: 'Delete this column',
					iconOnly: true,
					iconProps: { iconName: 'Delete' },
					onClick: () =>
						onRelevanceChange(ColumnRelevance.NotRelevant, columnName),
				},
			]
			return createDefaultCommandBar(items)
		},
		[onRelevanceChange, subjectIdentifier],
	)

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
		commandBar,
	}
}

export function useOnRelevanceChange({
	setTableColumns,
	tableColumns,
	setRelevance,
	relevance,
	onRemoveColumn,
}: {
	setTableColumns: Setter<TableColumn[] | undefined>
	tableColumns?: TableColumn[]
	setRelevance: Setter<ColumnRelevance | undefined>
	relevance?: ColumnRelevance
	onRemoveColumn: (columnName?: string) => void
}): (
	changedRelevance: ColumnRelevance | undefined,
	columnName?: string,
) => void {
	return useCallback(
		(changedRelevance: ColumnRelevance | undefined, columnName?: string) => {
			if (relevance === changedRelevance) {
				changedRelevance = undefined
			}

			setRelevance(changedRelevance)
			const column = {
				...tableColumns?.find(a => a.name === columnName),
				name: columnName,
				relevance: changedRelevance,
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
			if (changedRelevance === ColumnRelevance.NotRelevant) {
				onRemoveColumn(undefined)
			}
		},
		[setTableColumns, tableColumns, setRelevance, relevance, onRemoveColumn],
	)
}
