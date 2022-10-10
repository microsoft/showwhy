/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SVGProps } from 'react'

import type {
	BarChartOrientation,
	BarData,
	D3ScaleBand,
	D3ScaleLinear,
} from '../types.js'

export type BarProps = SVGProps<SVGRectElement> & {
	barElementClassName: string
	width: number
	widthOffset: number
	height: number
	xScale: D3ScaleBand | D3ScaleLinear
	yScale: D3ScaleLinear | D3ScaleBand
	orientation: BarChartOrientation
	data: BarData
	animation?: string
	renderRotatedLabel?: boolean
}
