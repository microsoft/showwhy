/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ArqueroDetailsListProps } from '@datashaper/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export const RawTableDefaultFeatures = {
	statsColumnHeaders: false,
}

export interface RawTableProps extends ArqueroDetailsListProps {
	table: ColumnTable
	error?: string
}
