/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDataTables } from '@showwhy/app-common'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { useSelectedTableName } from '../state/selectedDataPackage.js'
import type { Maybe } from '../types/primitives.js'

export function useOutputTable(): Maybe<ColumnTable> {
	const packages = useDataTables()
	const selectedTableName = useSelectedTableName()
	const pkg = packages.find(x => x.name === selectedTableName)
	return withRowNumbers(pkg?.currentOutput?.table)
}

function withRowNumbers(
	table: ColumnTable | undefined,
): ColumnTable | undefined {
	return table?.derive(
		{
			index: op.row_number(),
		},
		{ before: all() },
	)
}
