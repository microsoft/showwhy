/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { easeLinear, line as d3Line, select } from 'd3'
import { cloneDeep } from 'lodash'
import { useCallback, useMemo } from 'react'

import type { D3ScaleLinear, LineData } from '../types.js'
import { AnimationType } from './Line.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = easeLinear

export function usePathDefinitionFunc(
	xScale: D3ScaleLinear,
	yScale: D3ScaleLinear,
) {
	return useCallback(
		(lineData: LineData[]) => {
			const line = d3Line<[number, number | null]>().defined(function (
				d: [number, number | null],
			) {
				return d[1] !== null
			})
			const points = lineData.map(d => {
				return [xScale(d.date), d.value !== null ? yScale(d.value) : null]
			}) as Array<[number, number | null]>
			return line(points)
		},
		[xScale, yScale],
	)
}

export function useDataForPointsAtGapBounds(data: LineData[]) {
	return useMemo(() => {
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
}

interface AnimateProps {
	color: string
	data: LineData[]
	refDashed: React.MutableRefObject<SVGPathElement | null>
	refSolid: React.MutableRefObject<SVGPathElement | null>
	xScale: D3ScaleLinear
	yScale: D3ScaleLinear
}

interface AnimateSolidProps extends Omit<AnimateProps, 'refDashed'> {
	type?: AnimationType
}
interface AnimateDashedProps extends Omit<AnimateProps, 'refSolid'> {
	type?: AnimationType
}
export function useAnimate(props: AnimateProps) {
	const animateSolid = useAnimateSolid(props)
	const animateDashed = useAnimateDashed(props)

	return useCallback(
		(type?: AnimationType) => {
			animateDashed(type)
			animateSolid(type)
		},
		[animateDashed, animateSolid],
	)
}

function useAnimateSolid({
	color,
	data,
	refSolid,
	xScale,
	yScale,
}: AnimateSolidProps) {
	const pathDefinitionFunc = usePathDefinitionFunc(xScale, yScale)
	return useCallback(
		(type?: AnimationType) => {
			if (!refSolid.current) return
			const line = select<SVGPathElement, LineData[]>(refSolid.current)
				.datum(data)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)

			if (!type) return

			// Animation for Path and Left
			line.transition().duration(ANIMATION_DURATION).ease(EASING_FN)

			if (AnimationType.Left) {
				const totalLength = refSolid.current?.getTotalLength() || 0
				line
					.attr('stroke-dasharray', `${totalLength},${totalLength}`)
					.attr('stroke-dashoffset', totalLength)
					.attr('stroke-dashoffset', 0)
			}
		},
		[color, data, refSolid, pathDefinitionFunc],
	)
}

function useAnimateDashed({
	color,
	data,
	refDashed,
	xScale,
	yScale,
}: AnimateDashedProps) {
	const pathDefinitionFunc = usePathDefinitionFunc(xScale, yScale)
	const dataForPointsAtGapBounds = useDataForPointsAtGapBounds(data)
	return useCallback(
		(type?: AnimationType) => {
			if (!refDashed.current) return

			const line = select<SVGPathElement, LineData[]>(refDashed.current)
				.datum(dataForPointsAtGapBounds)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
				.style('stroke-dasharray', '3, 3')

			if (!type) return

			// Animation for Path and Left
			line.transition().duration(ANIMATION_DURATION).ease(EASING_FN)

			if (type === AnimationType.Left) {
				const totalLength = refDashed.current?.getTotalLength() || 0
				line
					.attr('stroke-dasharray', `${totalLength},${totalLength}`)
					.attr('stroke-dashoffset', totalLength)
			}
		},
		[color, data, refDashed, pathDefinitionFunc, dataForPointsAtGapBounds],
	)
}
