/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as d3 from 'd3'
import { memo, useCallback, useEffect, useRef } from 'react'

import type { LegendData } from '../types.js';
import { BAR_TRANSPARENT } from '../types.js'
import type { LegendProps } from './Legend.types.js'


const legendItemSize = 12
const legendSpacing = 4
const xOffset = 10
const yOffset = 10

export const Legend: React.FC<LegendProps> = memo(function Legend({
	data,
	...props
}) {
	const ref = useRef<HTMLDivElement | LegendData>(null)

	const renderLegend = useCallback(() => {
		if (ref.current) {
			ref.current.innerHTML = ''
			const legend = d3
				.select<HTMLDivElement, any>(ref.current)
				.append('svg')
				.attr('height', '100')
				.selectAll('.legendItem')
				.data(data)
			
			legend
				.enter()
				.append('rect')
				.attr('class', 'legendItem')
				.attr('width', legendItemSize)
				.attr('height', legendItemSize)
				.style('fill', d => d.color)
				.attr('opacity', BAR_TRANSPARENT)
				.attr('transform',
					(d, i) => {
						const y = yOffset + (legendItemSize + legendSpacing) * i
						return `translate(${xOffset}, ${y})`
					})
			legend
				.enter()
				.append('text')
				.attr('x', xOffset + legendItemSize + 5)
				.attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + legendItemSize)
				.text(d => d.name)
		}
	}, [ref])

	useEffect(() => {
		renderLegend()
	}, [
		renderLegend,
		data,
	])

	return <div className="legend" ref={ref} style={{ textAlign: 'center' }} {...props} />
})
