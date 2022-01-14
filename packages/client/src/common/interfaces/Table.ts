/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { ColumnRelation, ColumnRelevance } from '../enums'

export interface TableColumn {
	name: string
	isDone: boolean
	id?: string
	relevance?: ColumnRelevance
	comment?: string
	relation?: ColumnRelation[]
	invalidValues?: string[]
	tableName?: string
}

//TODO: naming columns is confusing
export interface BasicTable {
	columns: ColumnTable
	tableId: string
	tableName?: string
}

export interface DefinitionTable extends BasicTable {
	columnNames: string[]
}
