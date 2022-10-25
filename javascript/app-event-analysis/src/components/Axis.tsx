/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { axis as decorator } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { axisBottom, axisLeft, easeLinear, format, select } from 'd3'
import truncate from 'lodash-es/truncate'
import { memo, useEffect, useRef } from 'react'

import { MAX_BAR_COUNT_BEFORE_TICK_ROTATION } from '../types.js'
import type { AxisProps } from './Axis.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = easeLinear

export const Axis: React.FC<AxisProps> = memo(function Axis({
	type, // left or bottom
	myscale,
	transform,
	ticks,
	renderAxisLabels,
	tickFormatAsWholeNumber,
	disableAnimation,
}) {
	const theme = useThematic()
	const ref = useRef<SVGGElement | null>(null)
	useEffect(() => {
		if (ref.current) {
			const axisFn = type === 'left' ? axisLeft : axisBottom
			/* eslint-disable-next-line */
			const axis = axisFn(myscale as any)
			const g = select(ref.current)
			decorator(g, theme, axis)
			if (ticks !== undefined) {
				axis.ticks(ticks)
				if (ticks === 0) {
					axis.tickValues([])
				}
			}
			if (renderAxisLabels === false) {
				axis.tickValues([])
			}
			if (tickFormatAsWholeNumber) {
				/* eslint-disable-next-line */
				axis.tickFormat(format('04d') as any)
			}
			const axisGroup = select<SVGGElement, null>(ref.current)
			if (transform) {
				axisGroup.attr('transform', transform)
			}
			const renderedAxis = axisGroup.call(axis)
			if (!disableAnimation) {
				renderedAxis.transition().duration(ANIMATION_DURATION).ease(EASING_FN)
			}

			// rotate axis ticks if number bars are too many
			// alternatively, should bar label on hover
			if ((ticks === undefined || ticks > 0) && renderAxisLabels) {
				const numBars = myscale.domain().length
				const rotateBars =
					numBars > MAX_BAR_COUNT_BEFORE_TICK_ROTATION && type === 'bottom'
				renderedAxis
					.selectAll('text')
					.text(
						text =>
							(rotateBars
								? truncate(text as string, { length: 20 })
								: text) as string,
					)
					.style(
						'text-anchor',
						rotateBars || type === 'left' ? 'end' : 'middle',
					)
					.attr('dx', rotateBars || type === 'left' ? '-0.5em' : '0em')
					.attr('dy', rotateBars || type === 'left' ? '0.25rem' : '1em')
					.attr('transform', function () {
						return rotateBars ? 'rotate(-60)' : ''
					})
			}
		}
	}, [
		theme,
		disableAnimation,
		type,
		myscale,
		ticks,
		tickFormatAsWholeNumber,
		transform,
		renderAxisLabels,
	])
	return <g ref={ref} />
})
