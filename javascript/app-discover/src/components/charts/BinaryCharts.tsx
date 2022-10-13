/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import { Vega } from 'react-vega'

import { applyMappingFromVariableToTable } from '../../domain/CausalVariable.js'
import { useVisualizationSpec } from './BinaryCharts.hooks.js'
import type { ChartProps } from './Chart.types.js'

export const BinaryChart: React.FC<ChartProps> = memo(function BinaryChart({
	table,
	variable,
}) {
	const preparedData = applyMappingFromVariableToTable(
		variable,
		table,
	).objects()
	const spec = useVisualizationSpec(variable, preparedData)
	return <Vega mode={'vega-lite'} spec={spec} />
})
