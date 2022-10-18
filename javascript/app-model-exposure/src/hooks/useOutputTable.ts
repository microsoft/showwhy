/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDataTable } from '@datashaper/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { useSelectedTableName } from '../state/selectedDataPackage.js'
import type { Maybe } from '../types/primitives.js'

export function useOutputTable(): Maybe<ColumnTable> {
	const tableName = useSelectedTableName()
	return useDataTable(tableName)
}
