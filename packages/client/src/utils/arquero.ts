/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Pipeline,
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import {
	BaseFile,
	guessDelimiter,
	getTextFromFile,
} from '@data-wrangling-components/utilities'
import { fromCSV, all, op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { DataTableFileDefinition, ProjectFile } from '~types'
import { isZipUrl } from '~utils'
/**
 * Creates a default data table by parsing csv/tsv content.
 * This adds an incremented index column to the front to ensure all tables
 * have some form of unique id.
 * @param content
 * @param delimiter
 * @returns
 */
export function createDefaultTable(
	content: string,
	delimiter = ',',
): ColumnTable {
	return fromCSV(content, { delimiter }).derive(
		{
			index: op.row_number(),
		},
		{ before: all() },
	)
}

export async function loadTable(
	table: DataTableFileDefinition,
	tables?: File[],
): Promise<ColumnTable> {
	const file = tables?.find(t => t.name === table.name) as File
	const text = await getTextFromFile(file as BaseFile)
	const delimiter = table.delimiter || guessDelimiter(table.name)
	return createDefaultTable(text, delimiter)
}

export async function fetchTable(
	table: DataTableFileDefinition,
): Promise<ColumnTable> {
	return fetch(table.url)
		.then(res => res.text())
		.then(text => {
			const delimiter = table.delimiter || guessDelimiter(table.url)
			return createDefaultTable(text, delimiter)
		})
}

export async function fetchTables(
	tables: DataTableFileDefinition[],
	tableFiles: File[] = [],
): Promise<ColumnTable[]> {
	return Promise.all(
		tables.map(table => {
			if (isZipUrl(table.url)) {
				return loadTable(table, tableFiles as File[])
			}
			return fetchTable(table)
		}),
	)
}

/**
 * Utility to wrap execution of a pipeline without needing to
 * know about the TableStore, etc.
 * @param tables
 * @param spec
 */
export async function runPipeline(
	tables: DataTableFileDefinition[],
	steps: Step[],
	store: TableStore,
	pipeline: Pipeline,
	tableFiles?: File[],
): Promise<TableContainer> {
	const fetched = await fetchTables(tables, tableFiles)
	tables.forEach((table, index) => {
		store.set({
			id: table.name,
			table: fetched[index] as ColumnTable,
			name: table.name,
		})
	})
	pipeline.addAll(steps)

	return pipeline.run()
}

/**
 * Utility to wrap execution of a pipeline without needing to
 * know about the TableStore, etc.
 * @param tables
 * @param steps
 */
export async function runPipelineFromProjectFiles(
	tables: ProjectFile[],
	steps: Step[],
	store: TableStore,
	pipeline: Pipeline,
): Promise<any> {
	tables.forEach(table => {
		store.set({
			id: table.name,
			table: table?.table as ColumnTable,
			name: table.name,
		})
	})
	pipeline.addAll(steps)

	return pipeline.run()
}
