/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import type { AxisScale } from 'd3'
import { axisBottom, axisLeft, easeLinear, select } from 'd3'
import { memo, useEffect, useRef } from 'react'

import type { GridLineProps } from './GridLine.types.js'
import { GridLineType } from './GridLine.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = easeLinear

export const GridLine: React.FC<GridLineProps> = memo(function GridLine({
	type,
	myscale,
	ticks,
	tickSize,
	color,
	opacity = '',
	disableAnimation,
	...props
}) {
	const ref = useRef(null)
	const theme = useThematic()

	useEffect(() => {
		if (ref.current) {
			const gridGroup = select<SVGGElement, null>(ref.current)
				.attr('color', color || theme.gridLines().stroke().hex(0.33))
				.attr('opacity', opacity)
			const axisFn = type === GridLineType.Vertical ? axisLeft : axisBottom
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
	}, [disableAnimation, type, myscale, ticks, tickSize, color, opacity, theme])

	return <g ref={ref} {...props} />
})
