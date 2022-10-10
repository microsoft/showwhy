/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ArqueroDetailsListProps,
	DetailsListFeatures,
} from '@datashaper/react'
import { StatsColumnType } from '@datashaper/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export const RawTableDefaultFeatures = {
	statsColumnHeaders: true,
	statsColumnTypes: [StatsColumnType.Type],
}

export interface RawTableProps extends ArqueroDetailsListProps {
	table: ColumnTable
	label?: string
	error?: string
	features?: DetailsListFeatures
}
