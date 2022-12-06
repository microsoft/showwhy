/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { D3ScaleLinear } from '../types.js'

export interface GridProps {
	height: number
	width: number
	ticks?: number
	xScale: D3ScaleLinear
	yScale: D3ScaleLinear
}
