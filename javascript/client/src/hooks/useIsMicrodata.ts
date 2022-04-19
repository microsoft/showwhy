/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { agg, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useIsMicrodata(table?: ColumnTable, column?: string): boolean {
	return useMemo(() => {
		if (!table) return false
		const rows = table.numRows()
		const unique = agg(table, op.distinct(column))
		return rows === unique
	}, [table, column])
}
