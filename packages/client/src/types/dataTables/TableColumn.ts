/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnRelation } from './ColumnRelation'
import { ColumnRelevance } from './ColumnRelevance'

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
