/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'

export interface DataTable {
	table: ColumnTable
	tableId: string
	tableName?: string
	columnNames?: string[]
}
