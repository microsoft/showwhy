/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { D3ScaleLinear, OutputData, PlaceboOutputData } from '../types.js'

export interface CounterfactualLinesProps {
	xScale: D3ScaleLinear
	yScale: D3ScaleLinear
	hoverUnit: string
	outputData: (OutputData | PlaceboOutputData)[]

	renderRawData: boolean
	relativeIntercept: boolean
	isPlaceboSimulation: boolean
	showSynthControl: boolean
	applyIntercept: boolean
}

export interface CounterFactualLineData {
	x1: number
	x2: number
	y1: number
	y2: number
	className: string
	stroke: string
	strokeWidth: number
	strokeDasharray?: string
}
