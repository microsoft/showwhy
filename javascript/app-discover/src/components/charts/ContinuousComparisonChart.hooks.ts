/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RowObject } from 'arquero/dist/types/table/table.js'
import type { VisualizationSpec } from 'react-vega'

import type { CausalVariable } from '../../domain/CausalVariable.js'
import { useVegaSpec } from './hooks.js'
export function useVisualizationSpec(
	sourceVariable: CausalVariable,
	targetVariable: CausalVariable,
	values: RowObject[],
): VisualizationSpec {
	return useVegaSpec({
		data: { values },
		encoding: {
			x: { field: sourceVariable.columnName, type: 'quantitative' },
			y: { field: targetVariable.columnName, type: 'quantitative' },
		},
		mark: 'point',
	})
}
