/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RowObject } from 'arquero/dist/types/table/table'
import { ColumnRelevance } from '~enums'
import { TableColumn } from '~interfaces'
import { GenericFn, Setter } from '~types'

type SetTableColumns = Setter<TableColumn[]>
type SetRelevance = Setter<ColumnRelevance>

export interface ColumnDetailsProps {
	columnName: string
	fileId: string
	values: RowObject[] | undefined
	onRemoveColumn: (column: string) => void
}

export interface HistogramData {
	name: string
	count: number
}

export interface MissingArgs {
	values?: RowObject[]
	columnName: string
	invalidValues: string[]
	toggleInvalidValue: GenericFn
	tableColumns?: TableColumn[]
}

export interface OnChange {
	setTableColumns: SetTableColumns
	tableColumns?: TableColumn[]
	columnName: string
}

export interface OnRelevanceChangeArgs extends OnChange {
	setRelevance: SetRelevance
	relevance?: ColumnRelevance
	onRemoveColumn: GenericFn
}
