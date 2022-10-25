/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import * as d3 from 'd3'
import { cloneDeep, isEmpty, partition, uniq, unzip } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { useRecoilState } from 'recoil'

import { useShowPlaceboGraphs } from '../hooks/useShowPlaceboGraphs.js'
import { useTooltip } from '../hooks/useTooltip'
import {
	CheckedUnitsState,
	OutcomeNameState,
	TreatedUnitsState,
	TreatmentStartDatesState,
} from '../state/state.js'
import type { PlaceboOutputData } from '../types'
import { MAX_RENDERED_TREATED_UNITS, SYNTHETIC_UNIT } from '../types'
import type { LineData, OutputData, TooltipInfo } from '../types.js'
import {
	getHoverIdFromValue,
	getUnitFromBarChartData,
	isBarChartData,
} from '../utils/charts.js'
import { isValidUnit } from '../utils/validation.js'
import { Axis } from './Axis.js'
import { DrawingContainer } from './DrawingContainer.js'
import { GridLine } from './GridLine.js'
import { Line } from './Line.js'
import {
	useColors,
	useCounterfactual,
	useData,
	useLegends,
} from './LineChart.hooks.js'
import { TooltipContent } from './LineChart.styles.js'
import type { LineChartProps } from './LineChart.types.js'
import { constructLineTooltipContent } from './LineChart.utils.js'
import { ToolTip } from './ToolTip.js'

const LINE_WIDTH = 1
const LINE_WIDTH_TREATED = 2
const LINE_WIDTH_HOVER = 2
const OUTPUT_LINE_WIDTH = 3
const TREATMENT_LINE_WIDTH = 1.5
const CONTROL_LINE_WIDTH = 2
const TRANSPARENT_LINE = 0.25
const HIGHLIGHT_LINE = 1
const OUTPUT_LINE = 0.5
const LINE_ELEMENT_CLASS_NAME = 'line-element'

export const LineChart: React.FC<LineChartProps> = memo(function LineChart({
	inputData,
	outputData,
	showSynthControl,
	showGrid,
	applyIntercept,
	relativeIntercept,
	renderRawData,
	showTreatmentStart,
	dimensions,
	hoverInfo,
	showMeanTreatmentEffect,
	checkableUnits,
	onRemoveCheckedUnit,
	treatedUnitsList,
}) {
	const colors = useColors()
	const [hoverUnit, setHoverUnit] = useState('')

	const { width, height, margin } = dimensions
	const [checkedUnits] = useRecoilState(CheckedUnitsState)
	const [outcomeName] = useRecoilState(OutcomeNameState)
	const [treatedUnitsState] = useRecoilState(TreatedUnitsState)
	const [treatmentStartDates] = useRecoilState(TreatmentStartDatesState)
	const isPlaceboSimulation = useShowPlaceboGraphs()

	const treatedUnits = useMemo(
		() => treatedUnitsList || treatedUnitsState,
		[treatedUnitsState, treatedUnitsList],
	)

	const firstOutput = useMemo(
		() =>
			outputData.length > 0
				? outputData[0]
				: ({} as OutputData | PlaceboOutputData),
		[outputData],
	)

	// hacks to speed up computation:
	// cache treated units and selected units as maps
	const treatedUnitsMap = useMemo(() => {
		const updatdMap: { [unit: string]: number } = {}
		treatedUnits.forEach(unit => {
			updatdMap[unit] = 1
		})
		return updatdMap
	}, [treatedUnits])

	const {
		inputLines,
		outputLinesTreated,
		outputLinesControl,
		minValue,
		maxValue,
		dateRange,
		outputLinesIntercepted,
		outputLinesInterceptedRelative,
	} = useData(
		inputData,
		firstOutput, // the data for all output lines can be processed from the first result
		renderRawData,
		isPlaceboSimulation,
		applyIntercept,
		relativeIntercept,
		checkedUnits,
		treatedUnitsMap,
	)

	const outLines = useMemo(() => {
		const outLines = []
		// when not in placebo mode, there is always two lines available
		//  one from outputLinesTreated and one from outputLinesControl

		// if we are applying the intercept,
		//  then add the updated control line (i.e., outputLineIntercepted)
		if (applyIntercept && !isPlaceboSimulation) {
			// && outputLinesControl.length && outputLineIntercepted.length
			outputLinesIntercepted.forEach(outputLineIntercepted => {
				outLines.push(outputLineIntercepted)
				outLines.push(...outputLinesTreated)
			})
		}
		if (relativeIntercept || isPlaceboSimulation) {
			// clear existing data if "applyIntercept" caused some lines to be added
			outLines.length = 0

			// add reference horizontal line at zero
			if (outputLinesControl.length > 0) {
				const refLine = cloneDeep(outputLinesControl[0])
				refLine.forEach(point => {
					point.value = 0
					point.color = 'reference'
				})
				outLines.push(refLine)
			}

			// only render the outputLineInterceptedRelative reflecting the treated line relative to the reference control line
			// NOTE: consider also rendering the reference line as horizontal zero for better clarity
			outputLinesInterceptedRelative.forEach(outputLineInterceptedRelative => {
				const outputLineInterceptedRelativeUnit =
					outputLineInterceptedRelative[0].unit
				if (
					checkedUnits !== null &&
					checkedUnits.has(outputLineInterceptedRelativeUnit)
				) {
					outLines.push(outputLineInterceptedRelative)
				}
			})
		}

		if (outLines.length === 0) {
			outLines.push(...outputLinesControl)
			outLines.push(...outputLinesTreated)
		}

		return outLines
	}, [
		checkedUnits,
		applyIntercept,
		relativeIntercept,
		isPlaceboSimulation,
		outputLinesTreated,
		outputLinesControl,
		outputLinesIntercepted,
		outputLinesInterceptedRelative,
	])

	const aggregatedOutputLines = useMemo(() => {
		const aggregatedOutLines: LineData[][] = []
		if (
			showMeanTreatmentEffect &&
			!isPlaceboSimulation &&
			outLines.length > 2
		) {
			// outLines.length > 2 means we have more than one treatd unit
			// group all treated and synthetic lines into two groups of output lines
			const groupedOutLines = partition(outLines, lineData =>
				lineData[0].unit.startsWith('Synthetic'),
			)

			// NOTE: the size of "groupedOutLines" should be 2 because we only have two groups:
			//        treated lines group AND synthetic lines group

			groupedOutLines.forEach(group => {
				// 'group' represents all the actual or synthetic lines for all treated units
				// the goal is to aggregate the lines in this "group" into a single line
				const baselinePoints = group[0]
				const isSynth = baselinePoints[0].unit.startsWith('Synthetic')

				const treatedGroupName = 'Mean ' + (isSynth ? 'Synthetic' : 'Treated')
				const meanColor = treatedGroupName.toLowerCase()
				const allRecordsAtDate: number[][] = []
				group.forEach(lineData => {
					const valuesForLine = lineData.map(d => (d.value ? d.value : 0))
					allRecordsAtDate.push(valuesForLine)
				})
				const valuesPerDate = unzip(allRecordsAtDate)
				const values = valuesPerDate.map(item => {
					return item.reduce((a, b) => a + b)
				})
				const groupedLine = values.map((value, idx) => {
					const date = baselinePoints[idx].date
					return {
						unit: treatedGroupName,
						date: date,
						value: value / group.length,
						color: meanColor,
					} as LineData
				})

				// if the output has missing values (which is the case when time alignment is applied)
				const indicesMissingValues = baselinePoints
					.map((point, indx) => (point.value === null ? indx : -1))
					.filter(indx => indx !== -1)
				if (indicesMissingValues.length > 0) {
					for (let indx = 0; indx < indicesMissingValues.length; indx++) {
						const i = indicesMissingValues[indx]
						groupedLine[i].value = null
					}
				}

				aggregatedOutLines.push(groupedLine)
			})
		}
		return aggregatedOutLines
	}, [outLines, isPlaceboSimulation, showMeanTreatmentEffect])

	const { xScale, yScale } = useMemo(() => {
		const yValuePaddingPerc = 0.1
		const yAxisMaxValue = maxValue + maxValue * yValuePaddingPerc
		const yAxisMinValue = minValue + minValue * yValuePaddingPerc
		const xScale = d3
			.scaleLinear()
			.domain(dateRange as [number, number])
			.range([0, width])

		const yScale = d3
			.scaleLinear()
			.domain([yAxisMinValue, yAxisMaxValue])
			.range([height, 0])

		return {
			xScale,
			yScale,
		}
	}, [dateRange, minValue, maxValue, height, width])

	const getLineHoverAttributes = useCallback(
		(dt: LineData[]) => {
			let width = LINE_WIDTH
			let opacity = TRANSPARENT_LINE
			if (treatedUnits.every(isValidUnit)) {
				if (renderRawData) {
					if (treatedUnitsMap[dt[dt.length - 1].unit]) {
						// check last time stamp
						width = LINE_WIDTH_TREATED
						opacity = HIGHLIGHT_LINE
					}
				} else {
					// showing output lines: either with placebo output or not
					if (isPlaceboSimulation) {
						if (treatedUnitsMap[dt[dt.length - 1].unit]) {
							// check last time stamp
							width = LINE_WIDTH_TREATED
							opacity = HIGHLIGHT_LINE
						}
					} else {
						// showing the synthetic control and treated lines
						opacity = HIGHLIGHT_LINE
						width = OUTPUT_LINE_WIDTH
					}
				}
			}
			return {
				width,
				opacity,
			}
		},
		[renderRawData, treatedUnits, isPlaceboSimulation, treatedUnitsMap],
	)

	const tooltip = useTooltip()
	const {
		show: showTooltip,
		hide: hideTooltip,
		stick: persistTooltip,
		unStick: unPersistTooltip,
		stickyState: isTooltipPersisted,
	} = tooltip

	useEffect(() => {
		if (hoverInfo && hoverInfo.hoverItem) {
			const chart = d3.select('.line-chart')

			// hoverInfo.hoverItem is not null but it may have data of type BarData | LineData[]
			// re-construct the hoverItem to align with the current chart type
			// i.e., convert BarData to LineData[] as necessary
			if (isBarChartData(hoverInfo.hoverItem.data)) {
				//
				// hover interaction has originated from BarChart
				//
				const unit = getUnitFromBarChartData(hoverInfo.hoverItem.data)
				// find the line data that corresponds to unit then use it to show the tooltip
				// note that "date" will be undefined
				let data: LineData[] | null = null
				if (renderRawData) {
					const inputIndex = inputLines.findIndex(
						inputLine => inputLine[0].unit === unit,
					)
					if (inputIndex >= 0) {
						data = inputLines[inputIndex]
					}
				} else {
					const outIndex = outLines.findIndex(
						outLine => outLine[0].unit === unit,
					)
					if (outIndex >= 0) {
						data = outLines[outIndex]
					}
				}
				if (data) {
					const targetLine = chart.select<SVGPathElement>(
						'.' + getHoverIdFromValue(unit),
					)
					if (targetLine) {
						if (hoverInfo.hoverItem.isPreviousHover) {
							hideTooltip()
							const { width, opacity } = getLineHoverAttributes(
								data as LineData[],
							)
							targetLine.attr('stroke-width', width).attr('opacity', opacity)
						} else {
							const targetLineNode = targetLine.node()
							if (targetLineNode) {
								const targetLineBoundingRect =
									targetLineNode.getBoundingClientRect()
								const xPos = targetLineBoundingRect.x
								const yPos = targetLineBoundingRect.y
								const toolTipContent: { content: JSX.Element; unit: string } =
									constructLineTooltipContent(data as LineData[])
								showTooltip(toolTipContent.content, xPos, yPos, {
									unit: toolTipContent.unit,
									force: false,
								})
							}
							targetLine
								.attr('stroke-width', LINE_WIDTH_HOVER)
								.attr('opacity', HIGHLIGHT_LINE)
						}
					}
				}
			} else {
				// do nothing becasue the event has originated from the same chart
				//  and has been handled by the mouse move/leave event(s)
			}
		}
	}, [
		hoverInfo,
		hideTooltip,
		showTooltip,
		inputLines,
		outLines,
		renderRawData,
		getLineHoverAttributes,
	])
	const treatmentDates = useMemo(() => {
		const dates = Array.from(treatmentStartDates) // clone
		const outputDataNonPlacebo = firstOutput as OutputData
		const dataShiftedAndAligned =
			!isEmpty(outputDataNonPlacebo) &&
			outputDataNonPlacebo.time_mapping_applied
		if (
			!isPlaceboSimulation &&
			dataShiftedAndAligned &&
			!isEmpty(outputDataNonPlacebo) &&
			outputDataNonPlacebo.consistent_time_window !== null
		) {
			const treatmentDate = outputDataNonPlacebo.consistent_time_window[0]
			dates.forEach((date, indx) => {
				dates[indx] = treatmentDate
			})
		}
		return dates
	}, [treatmentStartDates, firstOutput, isPlaceboSimulation])

	const treatmentMarkers = useMemo(() => {
		if (!showTreatmentStart || treatmentDates.length === 0) return <></>
		// render one marker at each unique treated date
		// for each line marker, render a list of units treated at that date marker
		// render one background starting from the first treated date till the end
		const uniqueTreatedDates = uniq(treatmentDates)
		const treatedUnitsPerDate: { [key: number]: string[] } = {}
		treatedUnits.forEach((treatedUnit, indx) => {
			const treatmentDate = treatmentDates[indx]
			if (treatedUnitsPerDate[treatmentDate] === undefined)
				treatedUnitsPerDate[treatmentDate] = []
			treatedUnitsPerDate[treatmentDate].push(treatedUnit)
		})
		// due to scalability concerns,
		//  limit the number of rendered labels at any given treatment date
		uniqueTreatedDates.forEach(treatmentDate => {
			if (
				treatedUnitsPerDate[treatmentDate].length > MAX_RENDERED_TREATED_UNITS
			) {
				treatedUnitsPerDate[treatmentDate] = [
					'treated #: ' + treatedUnitsPerDate[treatmentDate].length.toString(),
				]
			}
		})
		return (
			<>
				{uniqueTreatedDates.map(treatedDate => {
					const treatedDateXPos = xScale(treatedDate)
					const marker = (
						<line
							stroke={colors.treatmentLine}
							x1={treatedDateXPos}
							x2={treatedDateXPos}
							y1={0}
							y2={height}
							strokeWidth={TREATMENT_LINE_WIDTH}
						/>
					)
					const labels = treatedUnitsPerDate[treatedDate].map(
						(treatedUnit, indx) => (
							<text
								key={treatedUnit}
								x={treatedDateXPos + 1}
								y={15 + indx * 20}
								opacity={0.5}
								cursor="default"
							>
								<title>{treatedUnit}</title>
								{treatedUnit}
							</text>
						),
					)
					return (
						<g key={treatedDate}>
							{marker}
							{labels}
						</g>
					)
				})}
				<rect
					width={width - xScale(treatmentDates[0])}
					height={height}
					x={xScale(treatmentDates[0])}
					opacity={0.03}
					fill={colors.treatmentLine}
					pointerEvents="none"
				/>
			</>
		)
	}, [
		colors,
		treatmentDates,
		treatedUnits,
		showTreatmentStart,
		height,
		width,
		xScale,
	])

	const legendGroupRef = useLegends(
		width,
		height,
		renderRawData,
		isPlaceboSimulation,
		relativeIntercept,
		outcomeName,
	)
	const controlGroupRef = useCounterfactual(
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
	)

	const handleLineMouseClickOrMove = useCallback(
		(event: React.MouseEvent<SVGElement>, fromClick = false) => {
			const path = d3.select<SVGElement, LineData[]>(event.target as SVGElement)
			const data = path.datum()

			const xPos = event.clientX
			const yPos = event.clientY
			const relXPos = event.nativeEvent.offsetX - margin.left
			const date = xScale.invert(relXPos)

			const toolTipContent: { content: JSX.Element; unit: string } =
				constructLineTooltipContent(data, date)
			showTooltip(toolTipContent.content, xPos, yPos, {
				unit: toolTipContent.unit,
				force: fromClick,
			})
			if (fromClick && checkableUnits.includes(toolTipContent.unit)) {
				persistTooltip()
			}

			if (!showMeanTreatmentEffect) {
				if (!renderRawData && !isPlaceboSimulation && data.length > 0) {
					//
					// hovering over an output line (either treated or synth-control line)
					//
					// de-emphasize all output lines
					//  except those that belong to the current treated unit
					const chart = d3.select('.line-chart')
					const currentUnit = data[0].unit
					const unit = currentUnit.startsWith(SYNTHETIC_UNIT)
						? currentUnit.substring(SYNTHETIC_UNIT.length + 1)
						: currentUnit
					treatedUnits.forEach(treatedUnit => {
						if (unit !== treatedUnit) {
							const targetLine = chart.selectAll<SVGPathElement, LineData[]>(
								'.' + getHoverIdFromValue(treatedUnit),
							)
							targetLine
								.attr('stroke-width', LINE_WIDTH)
								.attr('opacity', OUTPUT_LINE)
							// synthetic control line that corresponds to treated line
							const sunit = SYNTHETIC_UNIT + ' ' + treatedUnit
							const targetLine2 = chart.selectAll<SVGPathElement, LineData[]>(
								'.' + getHoverIdFromValue(sunit),
							)
							targetLine2
								.attr('stroke-width', LINE_WIDTH)
								.attr('opacity', OUTPUT_LINE)
						}
					})
				} else {
					// hover over input data lines or output lines from placebo results
					path
						.attr('stroke-width', LINE_WIDTH_HOVER)
						.attr('opacity', HIGHLIGHT_LINE)
				}

				ReactDOM.flushSync(() => {
					// this setState won't be batched
					hoverInfo.setHoverItem({
						data: data,
						xPos: xPos,
						yPos: yPos,
						date: date,
					} as TooltipInfo)
				})
			}
		},
		[
			margin.left,
			showTooltip,
			xScale,
			treatedUnits,
			hoverInfo,
			isPlaceboSimulation,
			renderRawData,
			showMeanTreatmentEffect,
			checkableUnits,
			persistTooltip,
		],
	)

	const handleLineMouseMove = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			handleLineMouseClickOrMove(event)
		},
		[handleLineMouseClickOrMove],
	)

	const handleLineMouseClick = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			handleLineMouseClickOrMove(event, true)

			if (!renderRawData && !isPlaceboSimulation && !showMeanTreatmentEffect) {
				// nodeName
				// mouse target is an output line
				event.stopPropagation()
				const path = d3.select<SVGElement, LineData[]>(
					event.target as SVGElement,
				)
				const data = path.datum()
				const currentUnit = data[0].unit
				setHoverUnit(currentUnit)
			}
		},
		[
			handleLineMouseClickOrMove,
			isPlaceboSimulation,
			renderRawData,
			showMeanTreatmentEffect,
		],
	)

	const handleLineMouseLeave = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			const path = d3.select<SVGElement, LineData[]>(event.target as SVGElement)
			const dt = path.datum()

			hideTooltip()

			if (!showMeanTreatmentEffect) {
				const { width, opacity } = getLineHoverAttributes(dt)
				path.attr('stroke-width', width).attr('opacity', opacity)

				// if non-placebo outline lines are shown, then reset their attributes
				if (!renderRawData && !isPlaceboSimulation) {
					// leaving hover over a non-placebo output line (either treated or synth-control line)
					const chart = d3.select('.line-chart')
					treatedUnits.forEach(treatedUnit => {
						// treated line
						const targetLine = chart.selectAll<SVGPathElement, LineData[]>(
							'.' + getHoverIdFromValue(treatedUnit),
						)
						targetLine
							.attr('stroke-width', OUTPUT_LINE_WIDTH)
							.attr('opacity', HIGHLIGHT_LINE)

						// synthetic control line that corresponds to treated line
						const unit = SYNTHETIC_UNIT + ' ' + treatedUnit
						const targetLine2 = chart.selectAll<SVGPathElement, LineData[]>(
							'.' + getHoverIdFromValue(unit),
						)
						targetLine2
							.attr('stroke-width', OUTPUT_LINE_WIDTH)
							.attr('opacity', HIGHLIGHT_LINE)
					})
				}

				ReactDOM.flushSync(() => {
					// this setState won't be batched
					hoverInfo.setHoverItem({
						data: dt,
						xPos: 0,
						yPos: 0,
						isPreviousHover: true,
					} as TooltipInfo)
				})
			}
		},
		[
			hideTooltip,
			isPlaceboSimulation,
			renderRawData,
			hoverInfo,
			treatedUnits,
			getLineHoverAttributes,
			showMeanTreatmentEffect,
		],
	)

	const handleContainerClick = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			const element = event.target as Element

			if (!element.classList.contains(LINE_ELEMENT_CLASS_NAME)) {
				hideTooltip(true)
				setHoverUnit('')
			}
		},
		[hideTooltip],
	)

	const handleRemoveLineClick = useCallback(
		(unit: string) => {
			hideTooltip(true)
			onRemoveCheckedUnit(unit)
		},
		[hideTooltip, onRemoveCheckedUnit],
	)

	const handleTooltipRemoved = useCallback(() => {
		unPersistTooltip()
	}, [unPersistTooltip])

	const handleClickOutside = useCallback(() => {
		hideTooltip(true)
	}, [hideTooltip])

	const lines = useMemo(() => {
		if (renderRawData) {
			return inputLines.map((ld, index) => (
				<Line
					key={index}
					className={`${LINE_ELEMENT_CLASS_NAME} ${getHoverIdFromValue(
						ld[0].unit,
					)}`}
					color={
						treatedUnitsMap[ld[ld.length - 1].unit]
							? colors.get('treated')
							: colors.control
					}
					xScale={xScale}
					yScale={yScale}
					data={ld}
					opacity={
						treatedUnitsMap[ld[ld.length - 1].unit]
							? HIGHLIGHT_LINE
							: TRANSPARENT_LINE
					}
					strokeWidth={
						treatedUnitsMap[ld[ld.length - 1].unit]
							? LINE_WIDTH_TREATED
							: LINE_WIDTH
					}
					animation="none"
					onMouseMove={handleLineMouseMove}
					onMouseLeave={handleLineMouseLeave}
					onClick={handleLineMouseClick}
				/>
			))
		} else {
			const filteredLines = outLines.filter(
				ld =>
					ld[0].color === 'treated' ||
					ld[0].color === 'relative' ||
					ld[0].color === 'reference' ||
					showSynthControl ||
					isPlaceboSimulation,
			)
			const outputLinesIncludingMean = filteredLines.concat(
				aggregatedOutputLines,
			)
			return outputLinesIncludingMean.map((ld, index) => (
				<Line
					key={index}
					className={`${LINE_ELEMENT_CLASS_NAME} ${getHoverIdFromValue(
						ld[0].unit,
					)}`}
					color={
						isPlaceboSimulation
							? treatedUnitsMap[ld[ld.length - 1].unit]
								? colors.get('treated')
								: colors.get(ld[0].color)
							: colors.get(ld[0].color)
					}
					xScale={xScale}
					yScale={yScale}
					data={ld}
					opacity={
						isPlaceboSimulation
							? treatedUnits.every(isValidUnit) &&
							  treatedUnitsMap[ld[ld.length - 1].unit]
								? HIGHLIGHT_LINE
								: TRANSPARENT_LINE
							: showMeanTreatmentEffect
							? treatedUnits.length === 1 || ld[0].color.startsWith('mean')
								? HIGHLIGHT_LINE
								: TRANSPARENT_LINE
							: HIGHLIGHT_LINE
					}
					strokeWidth={
						isPlaceboSimulation
							? treatedUnits.every(isValidUnit) &&
							  treatedUnitsMap[ld[ld.length - 1].unit]
								? LINE_WIDTH_TREATED
								: LINE_WIDTH
							: showMeanTreatmentEffect
							? treatedUnits.length === 1 || ld[0].color.startsWith('mean')
								? OUTPUT_LINE_WIDTH
								: LINE_WIDTH
							: OUTPUT_LINE_WIDTH
					}
					strokeDasharray={
						showMeanTreatmentEffect &&
						treatedUnits.length > 1 &&
						ld[0].color.startsWith('mean')
							? '3, 3'
							: ''
					}
					onMouseMove={handleLineMouseMove}
					onMouseLeave={handleLineMouseLeave}
					onClick={handleLineMouseClick}
				/>
			))
		}
	}, [
		colors,
		renderRawData,
		isPlaceboSimulation,
		inputLines,
		xScale,
		yScale,
		handleLineMouseLeave,
		handleLineMouseMove,
		handleLineMouseClick,
		showSynthControl,
		treatedUnits,
		treatedUnitsMap,
		outLines,
		aggregatedOutputLines,
		showMeanTreatmentEffect,
	])

	const counterfactualLines = useMemo(() => {
		if (hoverUnit === '' || outputData.length === 0 || isEmpty(outputData[0]))
			return <></>
		if (relativeIntercept || renderRawData || isPlaceboSimulation) return <></>

		const outputIndex = outputData.findIndex(output =>
			hoverUnit.includes(output.treatedUnit),
		)
		const outputDataNonPlacebo = outputData[outputIndex] as OutputData

		// REVIEW: 0 should be undefined
		const x1 =
			outputDataNonPlacebo &&
			outputDataNonPlacebo.time_before_intervention !== undefined
				? xScale(outputDataNonPlacebo.time_before_intervention)
				: 0
		const x2 =
			outputDataNonPlacebo &&
			outputDataNonPlacebo.time_after_intervention !== undefined
				? xScale(outputDataNonPlacebo.time_after_intervention)
				: 0
		return (
			<g>
				{showSynthControl && !applyIntercept && x1 > 0 && (
					<line
						className="controlLine"
						x1={x1}
						x2={x2}
						y1={yScale(outputDataNonPlacebo.control_pre_value)}
						y2={yScale(outputDataNonPlacebo.control_post_value)}
						stroke={colors.get('control')}
						strokeWidth={CONTROL_LINE_WIDTH}
					/>
				)}
				{x1 > 0 && (
					<>
						<line
							className="treatedLine"
							x1={x1}
							x2={x2}
							y1={yScale(outputDataNonPlacebo.treated_pre_value)}
							y2={yScale(outputDataNonPlacebo.treated_post_value)}
							stroke={colors.get('treated')}
							strokeWidth={CONTROL_LINE_WIDTH}
						/>
						<line
							className="counterfactualLine"
							x1={x1}
							x2={x2}
							y1={yScale(outputDataNonPlacebo.treated_pre_value)}
							y2={yScale(outputDataNonPlacebo.counterfactual_value)}
							stroke={colors.counterfactualLine}
							strokeWidth={CONTROL_LINE_WIDTH}
							strokeDasharray={'6, 4'}
						/>
					</>
				)}
				{showSynthControl && !applyIntercept && (
					<>
						{x1 > 0 && (
							<line
								className="counterfactualLine"
								x1={x1}
								x2={x1}
								y1={yScale(outputDataNonPlacebo.control_pre_value)}
								y2={yScale(outputDataNonPlacebo.treated_pre_value)}
								stroke={colors.counterfactualLine}
								strokeWidth={CONTROL_LINE_WIDTH}
								strokeDasharray={'6, 4'}
							/>
						)}
						<line
							className="counterfactualLine"
							x1={x2}
							x2={x2}
							y1={yScale(outputDataNonPlacebo.control_post_value)}
							y2={yScale(outputDataNonPlacebo.counterfactual_value)}
							stroke={colors.counterfactualLine}
							strokeWidth={CONTROL_LINE_WIDTH}
							strokeDasharray={'6, 4'}
						/>
					</>
				)}
			</g>
		)
	}, [
		colors,
		hoverUnit,
		outputData,
		relativeIntercept,
		renderRawData,
		isPlaceboSimulation,
		showSynthControl,
		applyIntercept,
		xScale,
		yScale,
	])

	const timePeriodsShouldBeAbstract = useMemo(() => {
		const uniqueTreatedDates = uniq(treatmentStartDates)
		const outputDataNonPlacebo = firstOutput as OutputData
		const dataShiftedAndAligned =
			!isEmpty(outputDataNonPlacebo) &&
			outputDataNonPlacebo.time_mapping_applied
		return uniqueTreatedDates.length > 1 && dataShiftedAndAligned
	}, [treatmentStartDates, firstOutput])

	return (
		<>
			<DrawingContainer
				className="line-chart"
				width={width}
				height={height}
				margin={margin}
				handleClickOutside={handleClickOutside}
				handleContainerClick={handleContainerClick}
			>
				{showGrid && (
					<>
						<GridLine
							type="vertical"
							myscale={yScale}
							tickSize={width}
							ticks={10}
							color={colors.gridLine}
							opacity={0.33}
						/>
						<GridLine
							myscale={xScale}
							tickSize={height}
							ticks={10}
							transform={`translate(0, ${height})`}
							color={colors.gridLine}
							opacity={0.33}
						/>
					</>
				)}
				<Axis type="left" myscale={yScale} ticks={5} />
				<Axis
					type="bottom"
					myscale={xScale}
					tickFormatAsWholeNumber={Number(!timePeriodsShouldBeAbstract)}
					transform={`translate(0, ${height})`}
				/>
				{treatmentMarkers}
				{lines}
				{counterfactualLines}
				<g ref={controlGroupRef} />
				<g ref={legendGroupRef} />
			</DrawingContainer>
			<ToolTip
				xPos={tooltip.x}
				yPos={tooltip.y}
				visible={tooltip.visible}
				onTooltipRemoved={handleTooltipRemoved}
			>
				<TooltipContent>
					<div>{tooltip.content}</div>
					{isTooltipPersisted && checkableUnits.includes(tooltip.unit) && (
						<DefaultButton
							text="Remove"
							onClick={() => handleRemoveLineClick(tooltip.unit)}
						/>
					)}
				</TooltipContent>
			</ToolTip>
		</>
	)
})
