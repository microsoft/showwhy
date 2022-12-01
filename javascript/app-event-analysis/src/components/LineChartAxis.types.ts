/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { D3Scale } from '../types.js'

export interface LineChartAxisProps {
	height: number
	tickFormatAsWholeNumber: number
	xScale: D3Scale
	yScale: D3Scale
}
