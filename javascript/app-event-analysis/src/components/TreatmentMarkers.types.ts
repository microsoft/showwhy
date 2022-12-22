/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { D3ScaleLinear, OutputData, PlaceboOutputData } from '../types.js'

export interface TreatmentMarkersProps {
	height: number
	width: number
	xScale: D3ScaleLinear
	treatedUnits: string[]
	outputData: (OutputData | PlaceboOutputData)[]
	showTreatmentStart: boolean
	isPlaceboSimulation: boolean
	treatmentStartDates: number[]
}
