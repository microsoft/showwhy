/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IComboBoxOption } from '@fluentui/react'
import { not } from 'arquero'
import { RowObject } from 'arquero/dist/types/table/table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ColumnRelevance } from '~enums'
import { useRestoreColumn } from '~hooks'
import { ProjectFile } from '~interfaces'
import {
	useOriginalTables,
	useProjectFiles,
	useSelectedFile,
	useSetSelectedFile,
	useTableColumns,
} from '~state'
import { GenericObject } from '~types'

export const useBusinessLogic = (): GenericObject => {
	const selectedFile = useSelectedFile()
	const setSelectedFile = useSetSelectedFile()
	const originalTables = useOriginalTables()
	const [headers, setHeaders] = useState<string[] | undefined>()
	const [selectedColumn, setSelectedColumn] = useState<string | null>()
	const tableColumns = useTableColumns(selectedFile?.id)
	const restoreColumn = useRestoreColumn(selectedFile?.id as string)
	const files = useProjectFiles()

	const removedColumns = useMemo((): string[] => {
		return (
			tableColumns
				?.filter(x => x.relevance === ColumnRelevance.NotCausallyRelevant)
				.map(x => x.name) || []
		)
	}, [tableColumns])

	const restoreOptions = useMemo((): IComboBoxOption[] => {
		return removedColumns.map(columnName => {
			return {
				key: columnName,
				text: columnName,
			}
		})
	}, [removedColumns])

	const selectedTable = useMemo(() => {
		return originalTables.find(x => x.tableId === selectedFile?.id)
	}, [originalTables, selectedFile])

	const data = useMemo((): RowObject[] => {
		if (!originalTables.length) return []
		setHeaders(selectedTable?.columns?.columnNames())
		return selectedTable?.columns?.objects().slice(0, 100) || []
	}, [originalTables, selectedTable])

	useEffect(() => {
		setSelectedFile(files[0])
	}, [files, setSelectedFile])

	useEffect(() => {
		if (selectedColumn) return
		setSelectedColumn(
			selectedTable?.columns?.select(not(removedColumns)).columnNames()[0],
		)
	}, [selectedTable, removedColumns, selectedColumn])

	const onChangeFile = useCallback(
		(projectFile: ProjectFile) => {
			setSelectedFile(projectFile)
			setSelectedColumn(
				selectedTable?.columns?.select(not(removedColumns)).columnNames()[0],
			)
		},
		[setSelectedFile, selectedTable, removedColumns],
	)

	return {
		data,
		files,
		headers,
		tableColumns,
		selectedFile,
		selectedTable,
		restoreOptions,
		onChangeFile,
		restoreColumn,
		selectedColumn,
		setSelectedColumn,
	}
}
