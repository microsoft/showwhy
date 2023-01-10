/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	BarChartOrientation,
	D3ScaleBand,
	D3ScaleLinear,
	Dimensions,
} from '../../types.js'
import type { AxisType } from '../Axis.types.js'

export interface BarChartAxisProps {
	type: AxisType
	xScale: D3ScaleLinear | D3ScaleBand
	yScale: D3ScaleLinear | D3ScaleBand

	barQuantity: number
	dimensions: Dimensions
	orientation: BarChartOrientation
}

export interface AxisData {
	renderAxisLabels: boolean
	heightExcludingAxis: number
	widthExcludingAxis: number
}
