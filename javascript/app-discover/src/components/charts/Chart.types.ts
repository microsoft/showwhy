/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export interface ChartProps {
	table: ColumnTable
	variable: CausalVariable
}
