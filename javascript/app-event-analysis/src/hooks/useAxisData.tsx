/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import type { Dimensions } from '../components/BarChart.types.js'
import type { AxisData } from '../components/BarChartAxis.types.js'
import { MAX_BAR_COUNT_WITH_VISIBLE_LABELS } from '../types.js'

export function useAxisData(
	barQuantity: number,
	dimensions: Dimensions,
	isColumn: boolean,
) {
	return useMemo<AxisData>(() => {
		const { height, width } = dimensions
		const renderAxisLabels =
			barQuantity <=
			(isColumn
				? MAX_BAR_COUNT_WITH_VISIBLE_LABELS * 2
				: MAX_BAR_COUNT_WITH_VISIBLE_LABELS)

		const heightExcludingAxis = isColumn ? height * 0.75 : height
		const widthExcludingAxis = isColumn
			? width
			: renderAxisLabels
			? width * 0.9
			: width

		return {
			renderAxisLabels,
			heightExcludingAxis,
			widthExcludingAxis,
		}
	}, [isColumn, dimensions, barQuantity])
}
