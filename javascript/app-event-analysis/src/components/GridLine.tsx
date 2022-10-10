/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AxisScale } from 'd3'
import { axisBottom, axisLeft, easeLinear, select } from 'd3'
import { memo, useEffect, useRef } from 'react'

import type { GridLineProps } from './GridLine.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = easeLinear

export const GridLine: React.FC<GridLineProps> = memo(function GridLine({
	type, // vertical or horizontal
	myscale,
	ticks,
	tickSize,
	disableAnimation,
	...props
}) {
	const ref = useRef(null)
	useEffect(() => {
		if (ref.current) {
			const gridGroup = select<SVGGElement, null>(ref.current)
			const axisFn = type === 'vertical' ? axisLeft : axisBottom
			const axis = axisFn(myscale as AxisScale<number>)
				.tickSize(-tickSize)
				.tickFormat(() => '')
				.ticks(ticks)

			if (disableAnimation) {
				gridGroup.call(axis)
			} else {
				gridGroup
					.call(axis)
					.transition()
					.duration(ANIMATION_DURATION)
					.ease(EASING_FN)
			}
		}
	}, [disableAnimation, type, myscale, ticks, tickSize])

	return <g ref={ref} {...props} />
})
