/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, not, op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import {
	useProjectFiles,
	useSelectedFile,
	useSelectOriginalTable,
	useSetOrUpdateOriginalTable,
	useSetProjectFiles,
	useSetTableColumns,
	useTableColumns,
} from '~state'
import {
	ProjectFile,
	TableColumn,
	TableDerivation,
	TableDerivationType,
} from '~types'

export function useTableWithColumnsDropped(): ColumnTable | undefined {
	const selectedFile = useSelectedFile()
	const originalTable = useSelectOriginalTable(selectedFile?.fileId as string)

	return useMemo(() => {
		const columns = selectedFile?.steps?.find(f => f.key === 'columns')?.value
		let table = originalTable().table
		columns?.map(v => (table = table?.select(not(v))))
		return table
	}, [originalTable, selectedFile])
}

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

export function useCaptureTable(
	tableId: string,
): (filteredTable: ColumnTable, columnName: string) => void {
	const projectFiles = useProjectFiles()
	const saveFile = useSaveFile(projectFiles, tableId)
	const originalTables = useSelectOriginalTable(tableId)

	return useCallback(
		(filteredTable: ColumnTable, columnName: string) => {
			const values = filteredTable.indices()
			const originalTable = originalTables().table
			const capturedTable = originalTable.derive({
				[columnName]: escape(d => (values.includes(d.index) ? '1' : '0')),
			}) as ColumnTable
			const newProjectFile = projectFiles.find(
				x => x.id === tableId,
			) as ProjectFile
			saveFile(newProjectFile, capturedTable)
		},
		[originalTables, projectFiles, tableId, saveFile],
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
				[columnName]: escape(d => d[columnToDuplicate]),
			}) as ColumnTable
			const newProjectFile = projectFiles.find(
				x => x.id === tableId,
			) as ProjectFile
			saveFile(newProjectFile, capturedTable)
		},
		[originalTables, projectFiles, tableId, saveFile],
	)
}

export function useRemoveColumn(tableId: string): (columnName: string) => void {
	const projectFiles = useProjectFiles()
	const saveFile = useSaveFile(projectFiles, tableId)
	const originalTables = useSelectOriginalTable(tableId)

	return useCallback(
		(columnName: string) => {
			const originalTable = originalTables()
			if (originalTable) {
				originalTable.table = originalTable.table.transform(table =>
					table.select(not(columnName)),
				)
				const newProjectFile = projectFiles.find(
					x => x.id === tableId,
				) as ProjectFile

				// const causalFactorsWithThisColumn = causalFactors.filter(
				// 	x => x.column === columnName,
				// )

				// if (causalFactorsWithThisColumn.length === 0) {
				saveFile(newProjectFile, originalTable.table)
				// }
			}
		},
		[originalTables, projectFiles, tableId, saveFile],
	)
}

export function useSetDeriveTable(
	fileId: string,
): (derive: TableDerivation) => ColumnTable {
	const projectFiles = useProjectFiles()

	const originalTables = useSelectOriginalTable(fileId)
	const saveFile = useSaveFile(projectFiles, fileId)
	return useCallback(
		(derive: TableDerivation) => {
			const originalTable = originalTables()
			const column = originalTable.table.select(derive.column)
			const columnUnique = column.dedupe()
			const ordered = columnUnique.orderby(derive.column)
			const ranked = ordered.derive({ rank: op.percent_rank() })
			let rank = ranked
				.filter(
					escape(d => {
						return d.rank >= +(1 - derive.threshold / 100).toFixed(2)
					}),
				)
				.objects()

			if (derive.type === TableDerivationType.PercentageBottomRanking) {
				rank = ranked
					.filter(
						escape(d => {
							return d.rank <= +(1 - derive.threshold / 100).toFixed(2)
						}),
					)
					.objects()
			}

			let capturedTable = originalTable?.table
			capturedTable = capturedTable.derive({
				[derive?.columnName]: escape(d =>
					rank.map(x => x[derive?.column]).includes(d[derive?.column])
						? 'TRUE'
						: 'FALSE',
				),
			}) as ColumnTable
			const newProjectFile = projectFiles.find(
				x => x.id === fileId,
			) as ProjectFile
			saveFile(newProjectFile, capturedTable)
			return capturedTable
		},
		[fileId, projectFiles, saveFile, originalTables],
	)
}

const TABLE_SAMPLE = 100

export function useDefaultTableSample(): number {
	return TABLE_SAMPLE
}

export function useRestoreColumn(
	selectedFileId: string,
): (value: string) => void {
	const tableColumns = useTableColumns(selectedFileId)
	const setTableColumns = useSetTableColumns(selectedFileId)

	return useCallback(
		value => {
			const columnName: string = value
			const column = {
				...tableColumns?.find(a => a.name === columnName),
				name: columnName,
				relevance: undefined,
			} as TableColumn

			const newArray = [
				...(tableColumns?.filter(a => a.name !== columnName) || []),
			]
			newArray.push(column)
			setTableColumns(newArray)
		},
		[tableColumns, setTableColumns],
	)
}

//TODO: Rename and remove old functions
export function useDeriveTable1(
	tableId: string,
): (capturedTable: ColumnTable) => void {
	const projectFiles = useProjectFiles()
	const saveFile = useSaveFile(projectFiles, tableId)

	return useCallback(
		(capturedTable: ColumnTable) => {
			const newProjectFile = projectFiles.find(
				x => x.id === tableId,
			) as ProjectFile
			saveFile(newProjectFile, capturedTable)
		},
		[projectFiles, tableId, saveFile],
	)
}
