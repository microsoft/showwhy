/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import {
	useProjectFiles,
	useSelectOriginalTable,
	useSetOrUpdateOriginalTable,
	useSetProjectFiles,
} from '~state'
import { ProjectFile } from '~types'

function useSaveFile(
	projectFiles: ProjectFile[],
	tableId: string,
): (newProjectFile: ProjectFile, capturedTable: ColumnTable) => void {
	const setOriginalTable = useSetOrUpdateOriginalTable()
	const setProjectFiles = useSetProjectFiles()

	return useCallback(
		(newProjectFile: ProjectFile, capturedTable: ColumnTable) => {
			const newCSV = capturedTable.toCSV()
			const project = { ...newProjectFile }
			project.content = newCSV
			setOriginalTable({ tableId, table: capturedTable })
			setProjectFiles([...projectFiles.filter(x => x.id !== tableId), project])
		},
		[projectFiles, tableId, setOriginalTable, setProjectFiles],
	)
}

export function useDuplicateColumn(
	tableId: string,
): (columnName: string, columnToDuplicate: string) => void {
	const projectFiles = useProjectFiles()
	const saveFile = useSaveFile(projectFiles, tableId)
	const originalTables = useSelectOriginalTable(tableId)

	return useCallback(
		(columnName: string, columnToDuplicate: string) => {
			const originalTable = originalTables().table
			const capturedTable = originalTable.derive({
				[columnName]: escape((d: any) => d[columnToDuplicate]),
			}) as ColumnTable
			const newProjectFile = projectFiles.find(
				x => x.id === tableId,
			) as ProjectFile
			saveFile(newProjectFile, capturedTable)
		},
		[originalTables, projectFiles, tableId, saveFile],
	)
}

const TABLE_SAMPLE = 100

export function useDefaultTableSample(): number {
	return TABLE_SAMPLE
}
