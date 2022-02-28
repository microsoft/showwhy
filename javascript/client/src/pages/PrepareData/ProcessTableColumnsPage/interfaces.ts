/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IColumn } from '@fluentui/react'
import type { Maybe, Setter } from '@showwhy/types'
import type { ColumnRelevance, TableColumn } from '~types'

export interface OnChange {
	setTableColumns: Setter<TableColumn[]>
	tableColumns?: TableColumn[]
}

export interface OnRelevanceChangeArgs extends OnChange {
	setRelevance: Setter<ColumnRelevance>
	relevance?: ColumnRelevance
	onRemoveColumn: (evt: any, column?: Maybe<IColumn>) => void
}
