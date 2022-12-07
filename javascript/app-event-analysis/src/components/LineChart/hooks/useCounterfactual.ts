/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { curveBasis, line, select } from 'd3'
import { isEmpty } from 'lodash'
import { useEffect, useRef } from 'react'

import { type ShowTooltip } from '../../../hooks/useTooltip.js'
import type {
	D3ScaleLinear,
	OutputData,
	PlaceboOutputData,
} from '../../../types'

import { useLineColors } from '../../../utils/useColors.js'

export function useCounterfactual(
	outputData: (OutputData | PlaceboOutputData)[],
	renderRawData: boolean,
	isPlaceboSimulation: boolean,
	showSynthControl: boolean,
	xScale: D3ScaleLinear,
	yScale: D3ScaleLinear,
	applyIntercept: boolean,
	relativeIntercept: boolean,
	width: number,
	height: number,
	hoverUnit: string,
	hideTooltip: () => void,
	showTooltip: ShowTooltip,
) {
	const colors = useLineColors()
	const ref = useRef(null)

	useEffect(() => {
		const g = select(ref.current)
		g.selectAll('*').remove()

		if (
			isPlaceboSimulation ||
			outputData.length === 0 ||
			isEmpty(outputData[0])
		)
			return

		const outputIndex =
			hoverUnit !== ''
				? outputData.findIndex(output => hoverUnit.includes(output.treatedUnit))
				: 0
		const outputDataNonPlacebo = outputData[outputIndex] as OutputData

		const x1 = xScale(outputDataNonPlacebo.time_before_intervention)
		const x2 = xScale(outputDataNonPlacebo.time_after_intervention)

		// pre-time
		// x1 will be -ve for synth-control since the time_before_intervention will be 0
		if (x1 > 0) {
			g.append('circle')
				.style('stroke', colors.timeMarker)
				.attr('r', 3)
				.attr('cx', x1)
				.attr('cy', height)
		}
		// post-time
		g.append('circle')
			.style('stroke', colors.timeMarker)
			.attr('r', 3)
			.attr('cx', x2)
			.attr('cy', height)

		//
		// Circle points for control, treated, and counterfactual lines
		//
		if (!renderRawData && hoverUnit !== '') {
			//
			// draw points
			//
			if (!applyIntercept && showSynthControl) {
				// control pre
				if (x1 > 0) {
					// x1 will be -ve for synth-control since the time_before_intervention will be 0
					g.append('circle')
						.style('stroke', colors.get('control'))
						.style('stroke-width', 2)
						.style('fill', colors.circleFill)
						.attr('r', 3)
						.attr('cx', x1)
						.attr('cy', yScale(outputDataNonPlacebo.control_pre_value))
						.on('mousemove', function (event: MouseEvent) {
							const xPos = event.clientX
							const yPos = event.clientY
							showTooltip({
								contentEl: outputDataNonPlacebo.control_pre_value.toFixed(2),
								xPos,
								yPos,
							})
						})
						.on('mouseleave', function (event: MouseEvent) {
							hideTooltip()
						})
				}
				// control post
				g.append('circle')
					.style('stroke', colors.get('control'))
					.style('stroke-width', 2)
					.style('fill', colors.circleFill)
					.attr('r', 3)
					.attr('cx', x2)
					.attr('cy', yScale(outputDataNonPlacebo.control_post_value))
					.on('mousemove', function (event: MouseEvent) {
						const xPos = event.clientX
						const yPos = event.clientY
						showTooltip({
							contentEl: outputDataNonPlacebo.control_post_value.toFixed(2),
							xPos,
							yPos,
						})
					})
					.on('mouseleave', function (event: MouseEvent) {
						hideTooltip()
					})
			}

			// treated pre
			if (x1 > 0) {
				// x1 will be -ve for synth-control since the time_before_intervention will be 0
				g.append('circle')
					.style('stroke', colors.get('treated'))
					.style('stroke-width', 2)
					.style('fill', colors.circleFill)
					.attr('r', 3)
					.attr('cx', x1)
					.attr('cy', yScale(outputDataNonPlacebo.treated_pre_value))
					.on('mousemove', function (event: MouseEvent) {
						const xPos = event.clientX
						const yPos = event.clientY
						showTooltip({
							contentEl: outputDataNonPlacebo.treated_pre_value.toFixed(2),
							xPos,
							yPos,
						})
					})
					.on('mouseleave', function (event: MouseEvent) {
						hideTooltip()
					})
			}
			// treated post
			g.append('circle')
				.style('stroke', colors.get('treated'))
				.style('stroke-width', 2)
				.style('fill', colors.circleFill)
				.attr('r', 3)
				.attr('cx', x2)
				.attr('cy', yScale(outputDataNonPlacebo.treated_post_value))
				.on('mousemove', function (event: MouseEvent) {
					const xPos = event.clientX
					const yPos = event.clientY
					showTooltip({
						contentEl: outputDataNonPlacebo.treated_post_value.toFixed(2),
						xPos,
						yPos,
					})
				})
				.on('mouseleave', function (event: MouseEvent) {
					hideTooltip()
				})
			// counterfactual
			g.append('circle')
				.style('stroke', colors.counterfactual)
				.style('stroke-width', 2)
				.style('fill', colors.circleFill)
				.attr('r', 3)
				.attr('cx', x2)
				.attr('cy', yScale(outputDataNonPlacebo.counterfactual_value))
				.on('mousemove', function (event: MouseEvent) {
					const xPos = event.clientX
					const yPos = event.clientY
					showTooltip({
						contentEl: outputDataNonPlacebo.counterfactual_value.toFixed(2),
						xPos,
						yPos,
					})
				})
				.on('mouseleave', function (event: MouseEvent) {
					hideTooltip()
				})

			//
			// draw arrow
			//
			const markerBoxWidth = 7
			const markerBoxHeight = 7
			const refX = markerBoxWidth / 2
			const refY = markerBoxHeight / 2
			const arrowHead = [
				[0, 0],
				[0, 6],
				[6, 3],
			]
			g.append('defs')
				.append('marker')
				.attr('id', 'arrow')
				.attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
				.attr('refX', refX)
				.attr('refY', refY)
				.attr('markerWidth', markerBoxWidth)
				.attr('markerHeight', markerBoxHeight)
				// .attr('orient', 'auto-start-reverse')
				.append('path')
				.attr('d', line()(arrowHead as Array<[number, number]>))
				.attr('stroke', colors.arrowStroke)
				.style('fill', colors.arrowFill)

			const counterfactualY = yScale(outputDataNonPlacebo.counterfactual_value)
			const postTreatedY = yScale(outputDataNonPlacebo.treated_post_value)
			const distance = Math.abs(postTreatedY - counterfactualY)
			const controlPointCurveOffset = distance * 0.25
			const topPoint =
				counterfactualY > postTreatedY ? postTreatedY : counterfactualY
			const bottomPoint =
				counterfactualY > postTreatedY ? counterfactualY : postTreatedY
			const arrowPoints = [
				[x2, topPoint], // top point
				[x2 + controlPointCurveOffset, topPoint + distance * 0.25], // control point
				[x2 + controlPointCurveOffset, topPoint + distance * 0.75], // control point
				[x2, bottomPoint], // bottom point
			]
			const arrowPointsOriented =
				counterfactualY > postTreatedY ? arrowPoints.reverse() : arrowPoints
			g.append('path')
				.style('stroke', colors.arrowStroke)
				.style('fill', 'none')
				.style('stroke-width', 2)
				.style('stroke-dasharray', '6, 4')
				.attr('marker-end', 'url(#arrow)')
				.attr(
					'd',
					line().curve(curveBasis)(
						arrowPointsOriented as Array<[number, number]>,
					),
				)
				.on('mousemove', function (event: MouseEvent) {
					const xPos = event.clientX
					const yPos = event.clientY
					showTooltip({
						contentEl: (
							outputDataNonPlacebo.treated_post_value -
							outputDataNonPlacebo.counterfactual_value
						).toFixed(2),
						xPos,
						yPos,
					})
				})
				.on('mouseleave', function (event: MouseEvent) {
					hideTooltip()
				})
		}
	}, [
		colors,
		outputData,
		renderRawData,
		isPlaceboSimulation,
		showSynthControl,
		xScale,
		yScale,
		applyIntercept,
		relativeIntercept,
		width,
		height,
		hoverUnit,
		hideTooltip,
		showTooltip,
	])

	return ref
}
