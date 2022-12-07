/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Map } from '../hooks/useTreatedUnitsMap.js'
import type { ChartOptions, D3ScaleLinear } from '../types.js'
import type { LineChartData, MouseHandlers } from './LineChart.types.js'

export interface SyntheticChartLinesProps extends ChartOptions {
	xScale: D3ScaleLinear
	yScale: D3ScaleLinear
	isPlaceboSimulation: boolean
	treatedUnits: string[]
	lineChartData: LineChartData
	mouseHandlers: MouseHandlers
	checkedUnits: Set<string> | null
}

export type PartialSyntheticChartLinesProps = Omit<
	SyntheticChartLinesProps,
	'xScale' | 'yScale' | 'mouseHandlers' | 'treatedUnits'
>

export interface LinePropsGetters
	extends Pick<
		SyntheticChartLinesProps,
		'isPlaceboSimulation' | 'showMeanTreatmentEffect' | 'treatedUnits'
	> {
	treatedUnitsMap: Map
}
