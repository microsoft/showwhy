/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SVGProps } from 'react'

import type { D3Scale } from '../types.js'

export type AxisProps = SVGProps<SVGGElement> & {
	type: 'left' | 'bottom'
	myscale: D3Scale
	transform?: string
	ticks?: number
	renderAxisLabels?: boolean
	tickFormatAsWholeNumber?: number
	disableAnimation?: boolean
}
