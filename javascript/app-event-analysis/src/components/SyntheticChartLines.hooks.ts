/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { cloneDeep, partition, unzip } from 'lodash'
import { useCallback, useMemo } from 'react'

import type { LineData } from '../types.js'
import {
	HIGHLIGHT_LINE,
	LINE_ELEMENT_CLASS_NAME,
	LINE_WIDTH,
	LINE_WIDTH_TREATED,
	OUTPUT_LINE_WIDTH,
	TRANSPARENT_LINE,
} from '../types.js'
import { getHoverIdFromValue } from '../utils/charts.js'
import { useLineColors } from '../utils/useColors.js'
import { isValidUnit } from '../utils/validation.js'
import type {
	LinePropsGetters,
	PartialSyntheticChartLinesProps,
} from './SyntheticChartLines.types.js'

export function useOutputLinesIncludingMean(
	props: PartialSyntheticChartLinesProps,
) {
	const outLines = useOutLines(props)
	const aggregatedOutputLines = useAggregatedOutputLines(props)
	const { isPlaceboSimulation, showSynthControl } = props
	return useMemo(() => {
		const filteredLines = outLines.filter(
			(ld) =>
				ld[0].color === 'treated' ||
				ld[0].color === 'relative' ||
				ld[0].color === 'reference' ||
				showSynthControl ||
				isPlaceboSimulation,
		)
		const outputLinesIncludingMean = filteredLines.concat(aggregatedOutputLines)
		return outputLinesIncludingMean
	}, [outLines, aggregatedOutputLines, isPlaceboSimulation, showSynthControl])
}
function useOutLines(props: PartialSyntheticChartLinesProps) {
	const {
		checkedUnits,
		applyIntercept,
		relativeIntercept,
		isPlaceboSimulation,
		lineChartData,
	} = props
	const {
		outputLinesTreated,
		outputLinesControl,
		outputLinesIntercepted,
		outputLinesInterceptedRelative,
	} = lineChartData
	return useMemo(() => {
		const outLines = []
		// when not in placebo mode, there is always two lines available
		//  one from outputLinesTreated and one from outputLinesControl

		// if we are applying the intercept,
		//  then add the updated control line (i.e., outputLineIntercepted)
		if (applyIntercept && !isPlaceboSimulation) {
			// && outputLinesControl.length && outputLineIntercepted.length
			outputLinesIntercepted.forEach((outputLineIntercepted) => {
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
				refLine.forEach((point: LineData) => {
					point.value = 0
					point.color = 'reference'
				})
				outLines.push(refLine)
			}

			// only render the outputLineInterceptedRelative reflecting the treated line relative to the reference control line
			// NOTE: consider also rendering the reference line as horizontal zero for better clarity
			outputLinesInterceptedRelative.forEach(
				(outputLineInterceptedRelative) => {
					const outputLineInterceptedRelativeUnit =
						outputLineInterceptedRelative[0].unit
					if (checkedUnits?.has(outputLineInterceptedRelativeUnit)) {
						outLines.push(outputLineInterceptedRelative)
					}
				},
			)
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
}

function useAggregatedOutputLines(props: PartialSyntheticChartLinesProps) {
	const outLines = useOutLines(props)
	const { isPlaceboSimulation, showMeanTreatmentEffect } = props
	return useMemo(() => {
		const aggregatedOutLines: LineData[][] = []
		if (
			showMeanTreatmentEffect &&
			!isPlaceboSimulation &&
			outLines.length > 2
		) {
			// outLines.length > 2 means we have more than one treatd unit
			// group all treated and synthetic lines into two groups of output lines
			const groupedOutLines = partition(outLines, (lineData) =>
				lineData[0].unit.startsWith('Synthetic'),
			)

			// NOTE: the size of "groupedOutLines" should be 2 because we only have two groups:
			//        treated lines group AND synthetic lines group

			groupedOutLines.forEach((group) => {
				// 'group' represents all the actual or synthetic lines for all treated units
				// the goal is to aggregate the lines in this "group" into a single line
				const baselinePoints = group[0]
				const isSynth = baselinePoints[0].unit.startsWith('Synthetic')

				const treatedGroupName = `Mean ${isSynth ? 'Synthetic' : 'Treated'}`
				const meanColor = treatedGroupName.toLowerCase()
				const allRecordsAtDate: number[][] = []
				group.forEach((lineData) => {
					const valuesForLine = lineData.map((d) => (d.value ? d.value : 0))
					allRecordsAtDate.push(valuesForLine)
				})
				const valuesPerDate = unzip(allRecordsAtDate)
				const values = valuesPerDate.map((item) => {
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
					.filter((indx) => indx !== -1)
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
}

export function useLinePropsGetters(props: LinePropsGetters) {
	const getColor = useGetColor(props)
	const getOpacity = useGetOpacity(props)
	const getStrokeWidth = useGetStrokeWidth(props)
	const getStrokeDasharray = useGetStrokeDasharray(props)
	return useMemo(() => {
		return {
			getClassName,
			getColor,
			getOpacity,
			getStrokeWidth,
			getStrokeDasharray,
		}
	}, [getColor, getOpacity, getStrokeWidth, getStrokeDasharray])
}

function getClassName(lineData: LineData[]) {
	return `${LINE_ELEMENT_CLASS_NAME} ${getHoverIdFromValue(lineData[0].unit)}`
}

function useGetColor(props: LinePropsGetters) {
	const colors = useLineColors()
	const { isPlaceboSimulation, treatedUnitsMap } = props
	return useCallback(
		(lineData: LineData[]) => {
			const isTreatedLine =
				isPlaceboSimulation &&
				treatedUnitsMap[lineData[lineData.length - 1].unit]

			return isTreatedLine
				? colors.get('treated')
				: colors.get(lineData[0].color)
		},
		[colors, treatedUnitsMap, isPlaceboSimulation],
	)
}

function useGetOpacity(props: LinePropsGetters) {
	const {
		isPlaceboSimulation,
		showMeanTreatmentEffect,
		treatedUnitsMap,
		treatedUnits,
	} = props
	return useCallback(
		(lineData: LineData[]) => {
			const isTreatedLine =
				treatedUnits.every(isValidUnit) &&
				treatedUnitsMap[lineData[lineData.length - 1].unit]
			const isMeanLine =
				treatedUnits.length === 1 || lineData[0].color.startsWith('mean')
			const renderTransparentLine =
				(isPlaceboSimulation && !isTreatedLine) ||
				(showMeanTreatmentEffect && !isMeanLine)

			return renderTransparentLine ? TRANSPARENT_LINE : HIGHLIGHT_LINE
		},
		[
			treatedUnits,
			treatedUnitsMap,
			isPlaceboSimulation,
			showMeanTreatmentEffect,
		],
	)
}

function useGetStrokeWidth(props: LinePropsGetters) {
	const {
		isPlaceboSimulation,
		showMeanTreatmentEffect,
		treatedUnitsMap,
		treatedUnits,
	} = props
	return useCallback(
		(lineData: LineData[]) => {
			let strokeWidth = OUTPUT_LINE_WIDTH
			const isTreatedLine =
				treatedUnits.every(isValidUnit) &&
				treatedUnitsMap[lineData[lineData.length - 1].unit]
			const isMeanLine =
				treatedUnits.length === 1 || lineData[0].color.startsWith('mean')
			const renderLineWidthTreated = isPlaceboSimulation && isTreatedLine
			const renderLineWidth =
				(isPlaceboSimulation && !isTreatedLine) ||
				(showMeanTreatmentEffect && !isMeanLine)

			if (renderLineWidthTreated) {
				strokeWidth = LINE_WIDTH_TREATED
			} else if (renderLineWidth) {
				strokeWidth = LINE_WIDTH
			}
			return strokeWidth
		},
		[
			treatedUnits,
			treatedUnitsMap,
			isPlaceboSimulation,
			showMeanTreatmentEffect,
		],
	)
}

function useGetStrokeDasharray(props: LinePropsGetters) {
	const { showMeanTreatmentEffect, treatedUnits } = props

	return useCallback(
		(lineData: LineData[]) => {
			return showMeanTreatmentEffect &&
				treatedUnits.length > 1 &&
				lineData[0].color.startsWith('mean')
				? '3, 3'
				: ''
		},
		[treatedUnits.length, showMeanTreatmentEffect],
	)
}
