/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useViewTable(
	selectedColumns: string[],
	outputTable?: ColumnTable,
	subjectIdentifier?: string,
): Maybe<ColumnTable> {
	return useMemo((): Maybe<ColumnTable> => {
		const columns = [subjectIdentifier || '', ...selectedColumns].filter(
			column => outputTable?.columnNames().includes(column),
		)

		return subjectIdentifier ? outputTable?.select(columns) : undefined
	}, [selectedColumns, subjectIdentifier, outputTable])
}
