/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { guessDelimiter } from '@datashaper/utilities'
import type { DataTableFileDefinition } from '@showwhy/types'
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { readFile } from '~utils'

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
	columnNames?: string[],
	autoType = false,
): ColumnTable {
	return fromCSV(content, {
		delimiter,
		header: !columnNames?.length,
		names: columnNames,
		autoMax: 10000,
		autoType,
	})
}

export async function loadTable(
	table: DataTableFileDefinition,
	tables?: File[],
): Promise<ColumnTable> {
	const file = tables?.find(t => t.name === table.name) as File
	const delimiter = table.delimiter || guessDelimiter(file.name)
	return readFile(file, delimiter, table.autoType)
}

export async function fetchTable(
	table: DataTableFileDefinition,
): Promise<ColumnTable> {
	return fetch(table.url)
		.then(res => res.text())
		.then(text => {
			const delimiter = table.delimiter || guessDelimiter(table.url)
			return createDefaultTable(text, delimiter, undefined, table.autoType)
		})
}
