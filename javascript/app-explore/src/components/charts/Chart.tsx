/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { VariableNature } from '../../domain/VariableNature.js'
import { BinaryChart } from './BinaryCharts.js'
import { CategoricalChart } from './CategoricalChart.js'
import type { ChartProps } from './Chart.types.js'
import { ContinuousChart } from './ContinuousChart.js'
import { DiscreteChart } from './DiscreteCharts.js'

export const Chart: React.FC<ChartProps> = memo(function Chart({
	table,
	variable,
}) {
	if (variable.nature === VariableNature.Binary) {
		return <BinaryChart table={table} variable={variable} />
	}

	if (
		variable.nature === VariableNature.CategoricalNominal ||
		variable.nature === VariableNature.CategoricalOrdinal
	) {
		return <CategoricalChart table={table} variable={variable} />
	}

	if (variable.nature === VariableNature.Continuous) {
		return <ContinuousChart table={table} variable={variable} />
	}

	return <DiscreteChart table={table} variable={variable} />
})
