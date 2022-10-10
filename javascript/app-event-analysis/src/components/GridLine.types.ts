/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SVGProps } from 'react'

import type { D3Scale } from '../types.js'

export type GridLineProps = SVGProps<SVGGElement> & {
	type?: 'vertical' | 'horizontal'
	myscale: D3Scale
	ticks: number
	tickSize: number
	disableAnimation?: boolean
}
