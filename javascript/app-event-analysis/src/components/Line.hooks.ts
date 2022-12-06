/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { line as d3Line, select } from 'd3'
import { cloneDeep } from 'lodash'
import { useCallback, useMemo } from 'react'

import type { D3ScaleLinear, LineData } from '../types.js'
import type { RenderLinesProps } from './Line.types.js'

function usePathDefinitionFunc(xScale: D3ScaleLinear, yScale: D3ScaleLinear) {
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

function useDataForPointsAtGapBounds(data: LineData[]) {
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

export function useRenderLines(props: RenderLinesProps) {
	const { data, color, refSolid, refDashed, xScale, yScale } = props
	const pathDefinitionFunc = usePathDefinitionFunc(xScale, yScale)
	const dataForPointsAtGapBounds = useDataForPointsAtGapBounds(data)
	return useCallback(() => {
		if (refSolid?.current) {
			select<SVGPathElement, LineData[]>(refSolid.current)
				.datum(data)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
		}
		if (refDashed?.current) {
			select<SVGPathElement, LineData[]>(refDashed.current)
				.datum(dataForPointsAtGapBounds)
				.attr('d', pathDefinitionFunc)
				.attr('stroke', color)
				.style('stroke-dasharray', '3, 3')
		}
	}, [
		data,
		refSolid,
		refDashed,
		dataForPointsAtGapBounds,
		pathDefinitionFunc,
		color,
	])
}
