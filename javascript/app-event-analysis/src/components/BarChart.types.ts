/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	BarChartOrientation,
	BarData,
	Dimensions,
	HoverInfo,
	LegendData,
} from '../types'

export interface BarChartProps {
	inputData: BarData[]
	dimensions: Dimensions
	orientation: BarChartOrientation
	hoverInfo: HoverInfo
	leftAxisLabel: string
	bottomAxisLabel: string
	checkableUnits: string[]
	checkedUnits: Set<string> | null
	treatedUnits: string[]
	isPlaceboSimulation: boolean
	renderLegend?: boolean
	onRemoveCheckedUnit: (unitToRemove: string) => void
}

export interface BarChartData {
	inputBars: BarData[]
	barNames: string[]
	minValue: number
	maxValue: number
	legendData: LegendData[]
}
