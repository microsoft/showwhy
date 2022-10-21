/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { curveBasis, extent, line, max, min, select } from 'd3'
import { cloneDeep, difference, groupBy, isEmpty, sortBy } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'

import type {
	D3ScaleLinear,
	LineData,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../types'
import { getColor } from './LineChart.utils.js'

export function useData(
	inputData: ProcessedInputData,
	outputData: OutputData | PlaceboOutputData,
	renderRawData: boolean,
	isPlaceboSimulation: boolean,
	applyIntercept: boolean,
	relativeIntercept: boolean,
	checkedUnits: Set<string> | null,
	treatedUnitsMap: { [unit: string]: number },
) {
	return useMemo(() => {
		const selectedUnits = Array.from(checkedUnits || [])

		// hacks to speed up computation:
		// cache treated units and selected units as maps
		const selectedUnitsMap: { [unit: string]: number } = {}
		selectedUnits.forEach(unit => {
			selectedUnitsMap[unit] = 1
		})

		// input lines represent lines for all selected units as well as the treated unit
		const inputLines = Object.values(
			groupBy(
				inputData.dataPoints
					.map(point => ({
						...point,
						color: point.treated ? 'treated' : 'control',
					}))
					.filter(
						line => treatedUnitsMap[line.unit] || selectedUnitsMap[line.unit],
					),
				'unit',
			),
		)

		let maxValue = 0
		let minValue = 0
		let dateRange: [number, number] | [undefined, undefined] = [0, 0]
		const outputLinesTreated: LineData[][] = []
		const outputLinesControl: LineData[][] = []
		const outputLinesIntercepted: LineData[][] = []
		const outputLinesInterceptedRelative: LineData[][] = []

		if (!isEmpty(outputData)) {
			if (renderRawData) {
				maxValue = max(inputLines.flat(), d => +d.value) ?? 0
				minValue = Math.min(0, min(inputLines.flat(), d => +d.value) ?? 0)
				// NOTE that inputLines is guaranteed to include many lines
				// because the "output" is valid in this block so the "input" must be valid too
				dateRange = extent(inputLines[0], d => d.date)
			} else {
				// if a consistent time window alignment is applied,
				//  then a subset of the data may have been used to generate the output
				//  i.e., the size of inputData.uniqueDates !== allDatesInOutputLines
				//
				// use the first output to pull the list of dates available in the treatment results
				const allDatesInOutputLines = outputData.output_lines_treated[0].map(
					point => point.date,
				)

				const outputDataNonPlacebo = outputData as OutputData
				const dataShiftedAndAligned = outputDataNonPlacebo.time_mapping_applied

				const missingDates = dataShiftedAndAligned
					? []
					: difference(inputData.uniqueDates, allDatesInOutputLines)

				//
				// if we have missing dates, lets add null for them,
				//  so that the line renderer may render them differently
				//

				outputData.output_lines_treated.forEach(treatedLine => {
					// must clone or otherwise applying the y intercept will be permenant
					const treatedLineClone = cloneDeep(treatedLine)
					if (missingDates.length > 0) {
						const dateBeforeTreatment = missingDates[0] - 1
						const pointBeforeTreatment = treatedLineClone.find(
							point => point.date === dateBeforeTreatment,
						)
						const valueAtTreatmentDate = pointBeforeTreatment
							? pointBeforeTreatment.value
							: 0
						missingDates.forEach((date, indx) => {
							treatedLineClone.push({
								date: date,
								value: indx === 0 ? valueAtTreatmentDate : null,
								unit: treatedLine[0].unit,
								color: treatedLine[0].color,
							})
						})
					}
					// sort to ensure proper line segments connectivity
					const treatedLineCloneSorted = sortBy(treatedLineClone, 'date')
					outputLinesTreated.push(treatedLineCloneSorted)
				})

				outputData.output_lines_control.forEach(controlLine => {
					// must clone or otherwise applying the y intercept will be permenant
					const controlLineClone = cloneDeep(controlLine)
					if (missingDates.length > 0) {
						const dateBeforeTreatment = missingDates[0] - 1
						const pointBeforeTreatment = controlLineClone.find(
							point => point.date === dateBeforeTreatment,
						)
						const valueAtTreatmentDate = pointBeforeTreatment
							? pointBeforeTreatment.value
							: 0
						missingDates.forEach((date, indx) => {
							controlLineClone.push({
								date: date,
								value: indx === 0 ? valueAtTreatmentDate : null,
								unit: controlLine[0].unit,
								color: controlLine[0].color,
							})
						})
					}
					// sort to ensure proper line segments connectivity
					const controlLineCloneSorted = sortBy(controlLineClone, 'date')
					outputLinesControl.push(controlLineCloneSorted)
				})

				// calculate max (outcome) value before applying intercept offset if applicable
				//  since it can change the output range

				outputLinesControl.forEach((controlLine, lineIndex) => {
					const outputLineIntercepted = controlLine.map(point => {
						return {
							...point,
							value:
								point.value !== null
									? point.value + outputData.intercept_offset[lineIndex]
									: null,
						}
					})
					outputLinesIntercepted.push(outputLineIntercepted)
				})

				outputLinesIntercepted.forEach((outputLineIntercepted, lineIndex) => {
					// we need to differentiate between applying y intercept as is or through the relative mode
					const outputLineInterceptedRelative: LineData[] = []
					outputLineIntercepted.forEach((point, pointIndx) => {
						const treatedPointVal =
							outputLinesTreated[lineIndex][pointIndx].value ?? 0
						const interceptedVal = point.value ?? 0
						outputLineInterceptedRelative.push({
							...point,
							unit: outputLinesTreated[lineIndex][pointIndx].unit,
							color: 'relative',
							value: treatedPointVal - interceptedVal,
						})
					})
					outputLinesInterceptedRelative.push(outputLineInterceptedRelative)
				})

				const allLinesPoints = [
					outputLinesControl.flat(),
					outputLinesTreated.flat(),
				].flat()
				const outputLinesInterceptedRelativeFlat =
					outputLinesInterceptedRelative.flat().flat()
				const outputLinesInterceptedFlat = outputLinesIntercepted.flat().flat()
				const linesForCalculatingMaxValue =
					relativeIntercept || isPlaceboSimulation
						? outputLinesInterceptedRelativeFlat
						: allLinesPoints
				maxValue =
					max(linesForCalculatingMaxValue, d => {
						return d.value !== null ? +d.value : null
					}) ?? 0
				if (applyIntercept) {
					const minInterceptedFlat =
						min(outputLinesInterceptedFlat, d => {
							return d.value !== null ? +d.value : null
						}) ?? 0
					minValue = Math.min(0, minInterceptedFlat)
				}
				if (relativeIntercept || isPlaceboSimulation) {
					const minInterceptedRelative =
						min(outputLinesInterceptedRelativeFlat, d => {
							return d.value !== null ? +d.value : null
						}) ?? 0
					minValue = Math.min(minInterceptedRelative, 0)
				}
				// NOTE that inputLines is guaranteed to include many lines
				// because the "output" is valid in this block so the "input" must be valid too
				dateRange = extent(allDatesInOutputLines)
			}
		} else {
			// since no output data are available, then we must calculate the max value from the input data
			maxValue = max(inputLines.flat(), d => +d.value) ?? 0

			// FIXME: should consider the global date range instead of pulling it from the first line
			dateRange = !inputLines[0] ? [0, 0] : extent(inputLines[0], d => d.date)
		}
		return {
			inputLines,
			outputLinesTreated,
			outputLinesControl,
			outputLinesIntercepted,
			outputLinesInterceptedRelative,
			minValue,
			maxValue,
			dateRange,
		}
	}, [
		inputData,
		outputData,
		renderRawData,
		isPlaceboSimulation,
		applyIntercept,
		relativeIntercept,
		checkedUnits,
		treatedUnitsMap,
	])
}

export function useLegends(
	width: number,
	height: number,
	renderRawData: boolean,
	isPlaceboSimulation: boolean,
	relativeIntercept: boolean,
	outputDisplayName: string,
) {
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
				.style('font-size', 'large')
				.style('fill', 'gray')
				.text('Time')
		} else {
			if (isPlaceboSimulation) {
				container
					.append('text')
					.attr('x', width * 0.28)
					.attr('y', height + legendOffsetFromAxis)
					.style('font-size', 'large')
					.style('fill', getColor('relative'))
					.text('Placebo distribution using all units')
			} else {
				if (!relativeIntercept) {
					container
						.append('text')
						.attr('x', width * 0.2)
						.attr('y', height + legendOffsetFromAxis)
						.style('font-size', 'large')
						.style('fill', getColor('treated'))
						.text('treated')
					container
						.append('text')
						.attr('x', width * 0.5)
						.attr('y', height + legendOffsetFromAxis)
						.style('font-size', 'large')
						.style('fill', getColor('control'))
						.text('synthetic control')
				} else {
					container
						.append('text')
						.attr('x', width * 0.2)
						.attr('y', height + legendOffsetFromAxis)
						.style('font-size', 'large')
						.style('fill', getColor('relative'))
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
			.style('font-size', 'large')
			.style('fill', 'gray')
			.text(
				isPlaceboSimulation || relativeIntercept
					? 'Diff in outcome vs control group'
					: outputDisplayName,
			)
	}, [
		renderRawData,
		isPlaceboSimulation,
		relativeIntercept,
		height,
		width,
		outputDisplayName,
	])
	return legendGroupRef
}

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
	showTooltip: (value: string, xPos: number, yPos: number) => void,
) {
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
				.style('stroke', 'blue')
				.attr('r', 3)
				.attr('cx', x1)
				.attr('cy', height)
		}
		// post-time
		g.append('circle')
			.style('stroke', 'blue')
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
						.style('stroke', getColor('control'))
						.style('stroke-width', 2)
						.style('fill', 'white')
						.attr('r', 3)
						.attr('cx', x1)
						.attr('cy', yScale(outputDataNonPlacebo.control_pre_value))
						.on('mousemove', function (event: MouseEvent) {
							const xPos = event.clientX
							const yPos = event.clientY
							showTooltip(
								outputDataNonPlacebo.control_pre_value.toFixed(2),
								xPos,
								yPos,
							)
						})
						.on('mouseleave', function (event: MouseEvent) {
							hideTooltip()
						})
				}
				// control post
				g.append('circle')
					.style('stroke', getColor('control'))
					.style('stroke-width', 2)
					.style('fill', 'white')
					.attr('r', 3)
					.attr('cx', x2)
					.attr('cy', yScale(outputDataNonPlacebo.control_post_value))
					.on('mousemove', function (event: MouseEvent) {
						const xPos = event.clientX
						const yPos = event.clientY
						showTooltip(
							outputDataNonPlacebo.control_post_value.toFixed(2),
							xPos,
							yPos,
						)
					})
					.on('mouseleave', function (event: MouseEvent) {
						hideTooltip()
					})
			}

			// treated pre
			if (x1 > 0) {
				// x1 will be -ve for synth-control since the time_before_intervention will be 0
				g.append('circle')
					.style('stroke', getColor('treated'))
					.style('stroke-width', 2)
					.style('fill', 'white')
					.attr('r', 3)
					.attr('cx', x1)
					.attr('cy', yScale(outputDataNonPlacebo.treated_pre_value))
					.on('mousemove', function (event: MouseEvent) {
						const xPos = event.clientX
						const yPos = event.clientY
						showTooltip(
							outputDataNonPlacebo.treated_pre_value.toFixed(2),
							xPos,
							yPos,
						)
					})
					.on('mouseleave', function (event: MouseEvent) {
						hideTooltip()
					})
			}
			// treated post
			g.append('circle')
				.style('stroke', getColor('treated'))
				.style('stroke-width', 2)
				.style('fill', 'white')
				.attr('r', 3)
				.attr('cx', x2)
				.attr('cy', yScale(outputDataNonPlacebo.treated_post_value))
				.on('mousemove', function (event: MouseEvent) {
					const xPos = event.clientX
					const yPos = event.clientY
					showTooltip(
						outputDataNonPlacebo.treated_post_value.toFixed(2),
						xPos,
						yPos,
					)
				})
				.on('mouseleave', function (event: MouseEvent) {
					hideTooltip()
				})
			// counterfactual
			g.append('circle')
				.style('stroke', 'gray')
				.style('stroke-width', 2)
				.style('fill', 'white')
				.attr('r', 3)
				.attr('cx', x2)
				.attr('cy', yScale(outputDataNonPlacebo.counterfactual_value))
				.on('mousemove', function (event: MouseEvent) {
					const xPos = event.clientX
					const yPos = event.clientY
					showTooltip(
						outputDataNonPlacebo.counterfactual_value.toFixed(2),
						xPos,
						yPos,
					)
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
				.attr('stroke', 'black')
				.style('fill', 'black')

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
				.style('stroke', 'black')
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
					showTooltip(
						(
							outputDataNonPlacebo.treated_post_value -
							outputDataNonPlacebo.counterfactual_value
						).toFixed(2),
						xPos,
						yPos,
					)
				})
				.on('mouseleave', function (event: MouseEvent) {
					hideTooltip()
				})
		}
	}, [
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
