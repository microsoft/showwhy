/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as d3 from 'd3'
import { cloneDeep } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'

import type { LineData } from '../types.js'
import type { LineProps } from './Line.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = d3.easeLinear

export const Line: React.FC<LineProps> = memo(function Line({
	xScale,
	yScale,
	color,
	data,
	animation,
	...props
}) {
	const refSolid = useRef<SVGPathElement | null>(null)
	const refDashed = useRef<SVGPathElement | null>(null)

	const missingDataExist = useMemo(() => {
		return data.some(d => d.value === null)
	}, [data])

	const dataForPointsAtGapBounds = useMemo(() => {
		// we need two valid data points at the gap bounds
		const points: LineData[] = []
		data.forEach((point, indx) => {
			if (point.value === null && points.length === 0) {
				points.push(cloneDeep(data[indx - 1]))
			}
			if (point.value !== null && points.length === 1) {
				points.push(cloneDeep(point))
			}
		})
		return points
	}, [data])

	const pathDefinitionFunc = useCallback(
		(lineData: LineData[]) => {
			const line = d3
				.line<[number, number | null]>()
				// handle missing data points
				.defined(function (d: [number, number | null]) {
					// if false is returned, d3 will skip rendering this element
					return d[1] !== null
				})
			const points = lineData.map(d => {
				return [xScale(d.date), d.value !== null ? yScale(d.value) : null]
			}) as Array<[number, number | null]>
			return line(points)
		},
		[xScale, yScale],
	)

	const animatePath = useCallback(() => {
		// render the line while skipping any missing data points in the middle
		if (refSolid.current) {
			d3.select<SVGPathElement, LineData[]>(refSolid.current)
				.datum(data)
				.transition()
				.duration(ANIMATION_DURATION)
				.ease(EASING_FN)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
		}
		// render only a placeholder (dashed line segment) for the missing data, if any
		if (refDashed.current) {
			d3.select<SVGPathElement, LineData[]>(refDashed.current)
				.datum(dataForPointsAtGapBounds)
				.transition()
				.duration(ANIMATION_DURATION)
				.ease(EASING_FN)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
				.style('stroke-dasharray', '3, 3')
		}
	}, [data, dataForPointsAtGapBounds, pathDefinitionFunc, color])

	const animateLeft = useCallback(() => {
		if (refSolid.current) {
			const totalLength = refSolid.current?.getTotalLength() || 0
			d3.select<SVGPathElement, LineData[]>(refSolid.current)
				.datum(data)
				.attr('stroke-dasharray', `${totalLength},${totalLength}`)
				.attr('stroke-dashoffset', totalLength)
				.attr('d', pathDefinitionFunc)
				.transition()
				.duration(ANIMATION_DURATION)
				.ease(EASING_FN)
				.attr('stroke-dashoffset', 0)
				.attr('stroke', color)
		}
		if (refDashed.current) {
			const totalLength = refDashed.current?.getTotalLength() || 0
			d3.select<SVGPathElement, LineData[]>(refDashed.current)
				.datum(dataForPointsAtGapBounds)
				.attr('stroke-dasharray', `${totalLength},${totalLength}`)
				.attr('stroke-dashoffset', totalLength)
				.attr('d', pathDefinitionFunc)
				.transition()
				.duration(ANIMATION_DURATION)
				.ease(EASING_FN)
				.style('stroke-dasharray', '3, 3')
				.attr('stroke', color)
		}
	}, [data, dataForPointsAtGapBounds, pathDefinitionFunc, color])

	const animateNone = useCallback(() => {
		if (refSolid.current) {
			d3.select<SVGPathElement, LineData[]>(refSolid.current)
				.datum(data)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
		}
		if (refDashed.current) {
			d3.select<SVGPathElement, LineData[]>(refDashed.current)
				.datum(dataForPointsAtGapBounds)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
				.style('stroke-dasharray', '3, 3')
		}
	}, [data, dataForPointsAtGapBounds, pathDefinitionFunc, color])

	useEffect(() => {
		switch (animation) {
			case 'path':
				animatePath()
				break
			case 'left':
				animateLeft()
				break
			default:
				animateNone()
				break
		}
	}, [animation, animatePath, animateLeft, animateNone])

	if (missingDataExist) {
		return (
			<g>
				<path ref={refSolid} fill="none" {...props} />
				<path ref={refDashed} fill="none" {...props} />
			</g>
		)
	} else {
		return <path ref={refSolid} fill="none" {...props} />
	}
})
