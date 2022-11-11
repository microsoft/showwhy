/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RowObject } from 'arquero/dist/types/table/table.js'
import type { VisualizationSpec } from 'react-vega'

import type { CausalVariable } from '../../domain/CausalVariable.jsx'
import { useVegaSpec } from './hooks.js'
export function useVisualizationSpec(
	varA: CausalVariable,
	varB: CausalVariable,
	values: RowObject[],
): VisualizationSpec {
	return useVegaSpec({
		data: { values },
		encoding: {
			color: {
				field: varA.columnName,
				legend: false,
			},
			x: { field: varA.columnName, type: 'quantitative' },
			y: { field: varB.columnName, type: 'ordinal' },
		},
		mark: 'tick',
	})
}
