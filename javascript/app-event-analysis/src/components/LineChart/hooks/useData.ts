/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { extent, max, min } from 'd3'
import { cloneDeep, difference, groupBy, isEmpty, sortBy } from 'lodash'
import { useMemo } from 'react'

import type {
	LineData,
	OutputData,
	PlaceboOutputData,
	ProcessedInputData,
} from '../../../types'
import type { LineChartData } from '../LineChart.types.js'

export function useData(
	inputData: ProcessedInputData,
	outputData: OutputData | PlaceboOutputData,
	renderRawData: boolean,
	isPlaceboSimulation: boolean,
	applyIntercept: boolean,
	relativeIntercept: boolean,
	checkedUnits: Set<string> | null,
	treatedUnitsMap: { [unit: string]: number },
): LineChartData {
	return useMemo(() => {
		const selectedUnits = Array.from(checkedUnits || [])

		// hacks to speed up computation:
		// cache treated units and selected units as maps
		const selectedUnitsMap = selectedUnits.reduce((acc, unit) => {
			acc[unit] = 1
			return acc
		}, {} as { [unit: string]: number })

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
