/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableStore, Pipeline } from '@data-wrangling-components/core'
import {
	BaseFile,
	guessDelimiter,
	getTextFromFile,
} from '@data-wrangling-components/utilities'
import { fromCSV, all, op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { DataTableFileDefinition } from '~types'
import { isZipUrl } from '~utils'
/**
 * Creates a default data table by parsing csv/tsv content.
 * This adds an incremented rowId column to the front to ensure all tables
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
			rowId: op.row_number(),
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
	tableFiles?: File[],
): Promise<any> {
	const store = new TableStore()
	const fetched = await fetchTables(tables, tableFiles)
	tables.forEach((table, index) => {
		store.set(table.name, fetched[index])
	})
	const pipeline = new Pipeline(store)
	pipeline.addAll(steps)

	return pipeline.run()
}
