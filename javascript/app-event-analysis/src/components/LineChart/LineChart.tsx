/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isEmpty, uniq } from 'lodash'
import React, { memo, useMemo, useState } from 'react'

import { useTreatedUnitsMap } from '../../hooks/useTreatedUnitsMap.js'
import type { PlaceboOutputData } from '../../types'
import type { OutputData } from '../../types.js'
import { ChartTooltip } from '../ChartTooltip.js'
import { CounterfactualLines } from '../CounterfactualLines.js'
import { DrawingContainer } from '../DrawingContainer.js'
import { Grid } from '../Grid.js'
import { LineChartAxis } from '../LineChartAxis.js'
import { RawChartLines } from '../RawChartLines.js'
import { SyntheticChartLines } from '../SyntheticChartLines.js'
import { TreatmentMarkers } from '../TreatmentMarkers.js'
import {
	useCounterfactual,
	useData,
	useLegends,
	useMouseHandlers,
	useScales,
} from './hooks/index.js'
import type { LineChartProps } from './LineChart.types.js'

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
	treatedUnits,
	isPlaceboSimulation,
	checkedUnits,
	outcomeName,
	treatmentStartDates,
}) {
	const [hoverUnit, setHoverUnit] = useState<string | undefined>()

	const { width, height, margin } = dimensions

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

	const { tooltip, handleContainerClick, handleClickOutside } = mouseHandlers

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
				{renderRawData ? (
					<RawChartLines
						xScale={xScale}
						yScale={yScale}
						treatedUnits={treatedUnits}
						lineChartData={lineChartData}
						mouseHandlers={mouseHandlers}
					/>
				) : (
					<SyntheticChartLines
						xScale={xScale}
						yScale={yScale}
						isPlaceboSimulation={isPlaceboSimulation}
						treatedUnits={treatedUnits}
						lineChartData={lineChartData}
						mouseHandlers={mouseHandlers}
						checkedUnits={checkedUnits}
						showSynthControl={showSynthControl}
						applyIntercept={applyIntercept}
						relativeIntercept={relativeIntercept}
						showMeanTreatmentEffect={showMeanTreatmentEffect}
					/>
				)}
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
