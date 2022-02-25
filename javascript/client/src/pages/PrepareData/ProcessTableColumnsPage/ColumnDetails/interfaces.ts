/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RowObject } from 'arquero/dist/types/table/table'
import type { TableColumn, Maybe } from '~types'

export interface ColumnDetailsProps {
	columnName: string
	fileId: string
	values: Maybe<RowObject[]>
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
	toggleInvalidValue: (value: string | null) => void
	tableColumns?: TableColumn[]
}
