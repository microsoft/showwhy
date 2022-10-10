/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ChartOptions,
	HoverInfo,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../types'

export interface LineChartProps extends ChartOptions {
	inputData: ProcessedInputData
	outputData: (OutputData | PlaceboOutputData)[]
	dimensions: {
		width: number
		height: number
		margin: { top: number; bottom: number; left: number; right: number }
	}
	hoverInfo: HoverInfo
	checkableUnits: string[]
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
