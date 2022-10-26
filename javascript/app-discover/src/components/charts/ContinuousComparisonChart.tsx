/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import { Vega } from 'react-vega'

import type { ComparisonChartProps } from './ComparisonChart.types.js'
import { useVisualizationSpec } from './ContinuousComparisonChart.hooks.js'

export const ContinuousComparisonChart: React.FC<ComparisonChartProps> = memo(
	function ContinuousComparisonChart({
		table,
		sourceVariable,
		targetVariable,
	}) {
		const preparedData = table
			.select([sourceVariable.columnName, targetVariable.columnName])
			.objects()

		const spec = useVisualizationSpec(
			sourceVariable,
			targetVariable,
			preparedData,
		)

		return <Vega mode={'vega'} spec={spec} actions={false} renderer={'svg'} />
	},
)
