/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnRelevance } from './ColumnRelevance'

export interface TableColumn {
	name: string
	isDone: boolean
	id?: string
	relevance?: ColumnRelevance
	comment?: string
	invalidValues?: string[]
	tableName?: string
}
