/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BarChartOrientation, BarData, HoverInfo } from '../types'

export interface BarChartProps {
	inputData: BarData[]
	dimensions: {
		width: number
		height: number
		margin: { top: number; bottom: number; left: number; right: number }
	}
	orientation: BarChartOrientation
	hoverInfo: HoverInfo
	leftAxisLabel: string
	bottomAxisLabel: string
	checkableUnits: string[]
	refLine?: boolean
	onRemoveCheckedUnit: (unitToRemove: string) => void
}
