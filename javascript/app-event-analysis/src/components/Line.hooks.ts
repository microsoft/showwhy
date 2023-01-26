/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { line as d3Line } from 'd3'
import { cloneDeep } from 'lodash'
import { useCallback, useMemo } from 'react'

import type { D3ScaleLinear, LineData } from '../types.js'

export function usePathDefinitionFunc(
	xScale: D3ScaleLinear,
	yScale: D3ScaleLinear,
) {
	return useCallback(
		(lineData: LineData[]) => {
			const line = d3Line<[number, number | null]>().defined(function (
				d: [number, number | null],
			) {
				return d[1] != null
			})
			const points = lineData.map((d) => {
				return [xScale(d.date), d.value != null ? yScale(d.value) : null]
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
			if (point.value == null && points.length === 0) {
				points.push(cloneDeep(data[indx - 1]))
			}
			if (point.value != null && points.length === 1) {
				points.push(cloneDeep(point))
			}
		})
		return points
	}, [data])
}
