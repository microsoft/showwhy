/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Vega } from 'react-vega'

import { applyMappingsFromRelationshipToTable } from '../../domain/Relationship.js'
import { useVisualizationSpec } from './CategoricalComparisonChart.hooks.js'
import type { ComparisonChartProps } from './ComparisonChart.types.js'

export const CategoricalComparisonChart: React.FC<ComparisonChartProps> = memo(
	function CategoricalComparisonChart({
		table,
		sourceVariable,
		targetVariable,
	}: ComparisonChartProps) {
		const preparedData = applyMappingsFromRelationshipToTable(
			sourceVariable,
			targetVariable,
			table,
		).objects()
		const spec = useVisualizationSpec(
			sourceVariable,
			targetVariable,
			preparedData,
		)
		console.log('categorical comparison', spec)
		return <Vega mode={'vega'} spec={spec} actions={false} renderer={'svg'} />
	},
)
