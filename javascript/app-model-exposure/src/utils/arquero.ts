/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
