/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { cloneDeep, isEmpty, partition, uniq, unzip } from 'lodash'
import React, { memo, useMemo, useState } from 'react'

import { useTreatedUnitsMap } from '../hooks/useTreatedUnitsMap.js'
import type { PlaceboOutputData } from '../types'
import type { LineData, OutputData } from '../types.js'
import { getHoverIdFromValue } from '../utils/charts.js'
import { useLineColors } from '../utils/useColors.js'
import { isValidUnit } from '../utils/validation.js'
import { ChartTooltip } from './ChartTooltip.js'
import { CounterfactualLines } from './CounterfactualLines.js'
import { DrawingContainer } from './DrawingContainer.js'
import { Grid } from './Grid.js'
import { Line } from './Line.js'
import {
	useCounterfactual,
	useData,
	useLegends,
	useMouseHandlers,
	useScales,
} from './LineChart.hooks.js'
import type { LineChartProps } from './LineChart.types.js'
import { LineChartAxis } from './LineChartAxis.js'
import { TreatmentMarkers } from './TreatmentMarkers.js'

const LINE_WIDTH = 1
const LINE_WIDTH_TREATED = 2
const OUTPUT_LINE_WIDTH = 3
const TRANSPARENT_LINE = 0.25
const HIGHLIGHT_LINE = 1
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
	treatedUnitsState,
	isPlaceboSimulation,
	checkedUnits,
	outcomeName,
	treatmentStartDates,
}) {
	const colors = useLineColors()
	const [hoverUnit, setHoverUnit] = useState('')

	const { width, height, margin } = dimensions

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

	const treatedUnitsMap = useTreatedUnitsMap(treatedUnits)

	const lineChartData = useData(
		inputData,
		firstOutput, // the data for all output lines can be processed from the first result
		renderRawData,
		isPlaceboSimulation,
		applyIntercept,
		relativeIntercept,
		checkedUnits,
		treatedUnitsMap,
	)

	const {
		inputLines,
		outputLinesTreated,
		outputLinesControl,
		outputLinesIntercepted,
		outputLinesInterceptedRelative,
	} = lineChartData

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

	const { xScale, yScale } = useScales(dimensions, lineChartData)

	const mouseHandlers = useMouseHandlers({
		xScale,
		hoverInfo,
		hoverUnit,
		checkableUnits,
		treatedUnits,
		renderRawData,
		showMeanTreatmentEffect,
		isPlaceboSimulation,
		leftMargin: margin.left,
		setHoverUnit,
	})

	const {
		tooltip,
		handleLineMouseMove,
		handleLineMouseClick,
		handleLineMouseLeave,
		handleContainerClick,
		handleClickOutside,
	} = mouseHandlers

	const { show: showTooltip, hide: hideTooltip } = tooltip

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

	const timePeriodsShouldBeAbstract = useMemo(() => {
		const uniqueTreatedDates = uniq(treatmentStartDates)
		const outputDataNonPlacebo = firstOutput as OutputData
		const dataShiftedAndAligned =
			!isEmpty(outputDataNonPlacebo) &&
			outputDataNonPlacebo.time_mapping_applied
		return uniqueTreatedDates.length > 1 && dataShiftedAndAligned
	}, [treatmentStartDates, firstOutput])

	const tickFormatAsWholeNumber = useMemo<number>(
		() => Number(!timePeriodsShouldBeAbstract),
		[timePeriodsShouldBeAbstract],
	)

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
					<Grid height={height} width={width} xScale={xScale} yScale={yScale} />
				)}
				<LineChartAxis
					height={height}
					xScale={xScale}
					yScale={yScale}
					tickFormatAsWholeNumber={tickFormatAsWholeNumber}
				/>
				<TreatmentMarkers
					height={height}
					width={width}
					xScale={xScale}
					outputData={outputData}
					treatedUnits={treatedUnits}
					showTreatmentStart={showTreatmentStart}
					isPlaceboSimulation={isPlaceboSimulation}
					treatmentStartDates={treatmentStartDates}
				/>
				{lines}
				<CounterfactualLines
					xScale={xScale}
					yScale={yScale}
					hoverUnit={hoverUnit}
					outputData={outputData}
					renderRawData={renderRawData}
					applyIntercept={applyIntercept}
					showSynthControl={showSynthControl}
					relativeIntercept={relativeIntercept}
					isPlaceboSimulation={isPlaceboSimulation}
				/>
				<g ref={controlGroupRef} />
				<g ref={legendGroupRef} />
			</DrawingContainer>
			<ChartTooltip
				tooltip={tooltip}
				checkedUnits={checkedUnits}
				checkableUnits={checkableUnits}
				onRemoveCheckedUnit={onRemoveCheckedUnit}
			/>
		</>
	)
})
