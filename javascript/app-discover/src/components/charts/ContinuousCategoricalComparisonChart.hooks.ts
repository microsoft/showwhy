/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { vega } from '@thematic/vega'
import type { RowObject } from 'arquero/dist/types/table/table.js'
import { useMemo } from 'react'
import type { VisualizationSpec } from 'react-vega'

import type { CausalVariable } from '../../domain/CausalVariable.jsx'
export function useVisualizationSpec(
	varA: CausalVariable,
	varB: CausalVariable,
	values: RowObject[],
): VisualizationSpec {
	const theme = useThematic()
	return useMemo(
		() =>
			vega(theme, {
				data: { values },
				encoding: {
					x: { aggregate: 'count' },
					color: {
						field: varA.columnName,
					},
					y: { field: varB.columnName, bin: true },
				},
				mark: 'rect',
			}),
		[theme, values, varA, varB],
	)
}
