/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { D3ScaleLinear } from '../types.js'
import type {
	LineChartData,
	MouseHandlers,
} from './LineChart/LineChart.types.js'

export interface RawChartLinesProps {
	xScale: D3ScaleLinear
	yScale: D3ScaleLinear
	treatedUnits: string[]
	lineChartData: LineChartData
	mouseHandlers: MouseHandlers
}
