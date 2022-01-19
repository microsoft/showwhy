/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RowObject } from 'arquero/dist/types/table/table'
import { TableColumn } from '~interfaces'
import { GenericFn } from '~types'

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
