/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RowObject } from 'arquero/dist/types/table/table.js'
import type { VisualizationSpec } from 'react-vega'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export function useVisualizationSpec(
	variable: CausalVariable,
	values: RowObject[],
): VisualizationSpec {
	return {
		data: { values },
		description: variable.description,
		encoding: {
			x: { field: variable.columnName, bin: true },
			y: { aggregate: 'count' },
		},
		mark: 'bar',
	}
}
