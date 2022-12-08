/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Tooltip } from '../../hooks/useTooltip.js'
import type {
	ChartOptions,
	D3ScaleLinear,
	Dimensions,
	HoverInfo,
	LineData,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../../types'

export interface LineChartProps extends ChartOptions {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	dimensions: Dimensions
	hoverInfo: HoverInfo
	checkableUnits: string[]
	treatedUnits: string[]
	checkedUnits: Set<string> | null
	isPlaceboSimulation: boolean
	outcomeName: string
	treatmentStartDates: number[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}

export interface MouseHandlersProps {
	xScale: D3ScaleLinear
	leftMargin: number
	hoverInfo: HoverInfo
	hoverUnit: string
	checkableUnits: string[]
	treatedUnits: string[]
	renderRawData: boolean
	showMeanTreatmentEffect: boolean
	isPlaceboSimulation: boolean
	setHoverUnit: (value: string) => void
}

export interface HandleLineMouseClickOrMoveProps extends MouseHandlersProps {
	tooltip: Tooltip
}

export interface LineChartData {
	inputLines: LineData[][]
	outputLinesTreated: LineData[][]
	outputLinesControl: LineData[][]
	outputLinesIntercepted: LineData[][]
	outputLinesInterceptedRelative: LineData[][]
	minValue: number
	maxValue: number
	dateRange: [number, number] | [undefined, undefined]
}

export interface MouseHandlers {
	tooltip: Tooltip
	handleContainerClick: (event: React.MouseEvent) => void
	handleLineMouseClick: (event: React.MouseEvent) => void
	handleLineMouseMove: (event: React.MouseEvent) => void
	handleLineMouseLeave: (event: React.MouseEvent) => void
	handleClickOutside: () => void
}
