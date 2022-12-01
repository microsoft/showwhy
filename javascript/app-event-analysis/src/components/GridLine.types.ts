/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SVGProps } from 'react'

import type { D3Scale } from '../types.js'

export enum GridLineType {
	Horizontal = 'horizontal',
	Vertical = 'vertical',
}

export type GridLineProps = SVGProps<SVGGElement> & {
	type?: GridLineType
	myscale: D3Scale
	ticks: number
	tickSize: number
	disableAnimation?: boolean
}
