/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import { Maybe } from '~types'

export function useViewTable(
	selectedColumns: string[],
	outputTable?: ColumnTable,
	subjectIdentifier?: string,
): Maybe<ColumnTable> {
	return useMemo((): Maybe<ColumnTable> => {
		const columns = [subjectIdentifier || '', ...selectedColumns].filter(x =>
			outputTable?.columnNames().includes(x),
		)
		//what if the user didnt chose one
		return subjectIdentifier ? outputTable?.select(columns) : undefined
	}, [selectedColumns, subjectIdentifier, outputTable])
}
