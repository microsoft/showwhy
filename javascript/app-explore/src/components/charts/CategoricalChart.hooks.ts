/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RowObject } from 'arquero/dist/types/table/table.js'
import { useMemo } from 'react'
import type { VisualizationSpec } from 'react-vega'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export function useVisualizationSpec(
	variable: CausalVariable,
	data: RowObject[],
): VisualizationSpec {
	return useMemo(
		() => ({
			data: { values: data },
			description: variable.description,
			encoding: {
				x: { aggregate: 'count' },
				color: { field: variable.columnName },
			},
			mark: 'bar',
		}),
		[variable, data],
	)
}
