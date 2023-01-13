/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import { Vega } from 'react-vega'

import { applyMappingFromVariableToTable } from '../../domain/CausalVariable.js'
import { VariableNature } from '../../domain/VariableNature.js'
import type { ComparisonChartProps } from './ComparisonChart.types.js'
import { useVisualizationSpec } from './ContinuousCategoricalComparisonChart.hooks.js'

export const ContinuousCategoricalComparisonChart: React.FC<ComparisonChartProps> =
	memo(function ContinuousCategoricalComparisonChart({
		table,
		sourceVariable,
		targetVariable,
	}) {
		let varA = sourceVariable
		let varB = targetVariable
		if (
			targetVariable.nature === VariableNature.Continuous ||
			targetVariable.nature === VariableNature.Discrete
		) {
			varA = targetVariable
			varA = targetVariable
			varB = sourceVariable
		}

		const selectedData = table.table?.select([varA.columnName, varB.columnName])
		const preparedData = selectedData == null ? null : applyMappingFromVariableToTable(
			varA,
			selectedData,
			false,
		).objects()

		const spec = useVisualizationSpec(varA, varB, preparedData ?? [])

		return <Vega mode={'vega'} spec={spec} actions={false} renderer={'svg'} />
	})
