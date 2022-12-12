/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { select } from 'd3'
import { useEffect, useRef } from 'react'

import { useLineColors } from '../../../utils/useColors.js'

const axisFontSize = '14px'

export function useLegends(
	width: number,
	height: number,
	renderRawData: boolean,
	isPlaceboSimulation: boolean,
	relativeIntercept: boolean,
	outputDisplayName: string,
) {
	const colors = useLineColors()
	const legendGroupRef = useRef(null)
	useEffect(() => {
		const container = select(legendGroupRef.current)
		container.selectAll('*').remove()

		const legendOffsetFromAxis = 40
		if (renderRawData) {
			container
				.append('text')
				.attr('x', width * 0.45)
				.attr('y', height + legendOffsetFromAxis)
				.style('font-size', axisFontSize)
				.style('fill', colors.defaultAxisTitle)
				.text('Time')
		} else {
			if (isPlaceboSimulation) {
				container
					.append('text')
					.attr('x', width * 0.28)
					.attr('y', height + legendOffsetFromAxis)
					.style('font-size', axisFontSize)
					.style('fill', colors.get('relative'))
					.text('Placebo distribution using all units')
			} else {
				if (!relativeIntercept) {
					container
						.append('text')
						.attr('x', width * 0.2)
						.attr('y', height + legendOffsetFromAxis)
						.style('font-size', axisFontSize)
						.style('fill', colors.get('treated'))
						.text('Treated')
					container
						.append('text')
						.attr('x', width * 0.5)
						.attr('y', height + legendOffsetFromAxis)
						.style('font-size', axisFontSize)
						.style('fill', colors.get('control'))
						.text('Synthetic control')
				} else {
					container
						.append('text')
						.attr('x', width * 0.2)
						.attr('y', height + legendOffsetFromAxis)
						.style('font-size', axisFontSize)
						.style('fill', colors.get('relative'))
						.text('Difference between treated and synthetic units')
				}
			}
		}
		const axisLabelX = legendOffsetFromAxis
		const axisLabelY = height / 2
		container
			.append('g')
			.attr('transform', `translate(${-axisLabelX}, ${axisLabelY})`)
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'rotate(-90)')
			.style('font-size', axisFontSize)
			.style('fill', colors.defaultAxisTitle)
			.text(
				isPlaceboSimulation || relativeIntercept
					? 'Diff in outcome vs control group'
					: outputDisplayName,
			)
	}, [
		colors,
		renderRawData,
		isPlaceboSimulation,
		relativeIntercept,
		height,
		width,
		outputDisplayName,
	])
	return legendGroupRef
}
