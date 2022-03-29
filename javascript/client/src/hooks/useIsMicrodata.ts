/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { op } from 'arquero'
import * as aq from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

export function useIsMicrodata(): (
	table: ColumnTable,
	column: string,
) => boolean {
	return useCallback((table: ColumnTable, column: string) => {
		const rows = table.numRows()
		const unique = aq.agg(table, op.distinct(column))
		return rows === unique
	}, [])
}
