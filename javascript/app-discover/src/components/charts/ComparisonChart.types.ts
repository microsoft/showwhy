/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableContainer } from '@datashaper/tables'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export interface ComparisonChartProps {
	table: TableContainer
	sourceVariable: CausalVariable
	targetVariable: CausalVariable
}
