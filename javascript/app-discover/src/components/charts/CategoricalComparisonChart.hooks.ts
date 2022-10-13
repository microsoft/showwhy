/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RowObject } from 'arquero/dist/types/table/table.js'
import { useMemo } from 'react'
import type { VisualizationSpec } from 'react-vega'

import type { CausalVariable } from '../../domain/CausalVariable.js'

export function useVisualizationSpec(
	sourceVariable: CausalVariable,
	targetVariable: CausalVariable,
	data: RowObject[],
): VisualizationSpec {
	return useMemo(
		() => ({
			data: { values: data },
			encoding: {
				x: { aggregate: 'count' },
				y: { field: targetVariable.columnName },
				color: {
					field: sourceVariable.columnName,
				},
			},
			mark: 'bar',
		}),
		[data, sourceVariable, targetVariable],
	)
}
