/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import { Vega } from 'react-vega'

import type { ChartProps } from './Chart.types.js'
import { useVisualizationSpec } from './ContinuousChart.hooks.js'

export const ContinuousChart: React.FC<ChartProps> = memo(
	function ContinuousChart({ table, variable }) {
		const preparedData = table.select(variable.columnName).objects()
		const spec = useVisualizationSpec(variable, preparedData)
		console.log('continuous', spec)
		return <Vega mode={'vega'} spec={spec} actions={false} renderer={'svg'} />
	},
)
