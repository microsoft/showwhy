/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { scaleLinear } from 'd3'
import { useMemo } from 'react'

import type { D3ScaleLinear, Dimensions } from '../../../types'
import type { LineChartData } from '../LineChart.types.js'

export function useScales(
	dimensions: Dimensions,
	lineChartData: LineChartData,
): { xScale: D3ScaleLinear; yScale: D3ScaleLinear } {
	const { minValue, maxValue, dateRange } = lineChartData
	const { height, width } = dimensions
	return useMemo(() => {
		const yValuePaddingPerc = 0.1
		const yAxisMaxValue = maxValue + maxValue * yValuePaddingPerc
		const yAxisMinValue = minValue + minValue * yValuePaddingPerc
		const xScale = scaleLinear()
			.domain(dateRange as [number, number])
			.range([0, width])

		const yScale = scaleLinear()
			.domain([yAxisMinValue, yAxisMaxValue])
			.range([height, 0])

		return {
			xScale,
			yScale,
		}
	}, [dateRange, minValue, maxValue, height, width])
}
