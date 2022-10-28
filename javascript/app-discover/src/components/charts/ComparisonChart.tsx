/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { VariableNature } from '../../domain/VariableNature.js'
import { CategoricalComparisonChart } from './CategoricalComparisonChart.js'
import type { ComparisonChartProps } from './ComparisonChart.types.js'
import { ContinuousCategoricalComparisonChart } from './ContinuousCategoricalComparisonChart.js'
import { ContinuousComparisonChart } from './ContinuousComparisonChart.js'

export const ComparisonChart: React.FC<ComparisonChartProps> = memo(
	function ComparisonChart(props) {
		const { sourceVariable, targetVariable } = props
		if (
			(sourceVariable.nature === VariableNature.Continuous ||
				sourceVariable.nature === VariableNature.Discrete) &&
			(targetVariable.nature === VariableNature.Continuous ||
				targetVariable.nature === VariableNature.Discrete)
		) {
			return <ContinuousComparisonChart {...props} />
		}

		if (
			sourceVariable.nature === VariableNature.Continuous ||
			sourceVariable.nature === VariableNature.Discrete ||
			targetVariable.nature === VariableNature.Continuous ||
			targetVariable.nature === VariableNature.Discrete
		) {
			return <ContinuousCategoricalComparisonChart {...props} />
		}

		return <CategoricalComparisonChart {...props} />
	},
)
