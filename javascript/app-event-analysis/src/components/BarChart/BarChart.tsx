/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'

import { BAR_ELEMENT_CLASS_NAME, BarChartOrientation } from '../../types.js'
import { getHoverIdFromValue } from '../../utils/charts.js'
import { AxisType } from '../Axis.types.js'
import { ChartTooltip } from '../ChartTooltip.js'
import { DrawingContainer } from '../DrawingContainer.js'
import { Legend } from '../Legend.js'
import { Bar } from './Bar.js'
import {
	useData,
	useGetScales,
	useHandlers,
	useLegends,
} from './BarChart.hooks.js'
import type { BarChartProps } from './BarChart.types.js'
import { BarChartAxis } from './BarChartAxis.js'
import { useAxisData } from './hooks/useAxisData.js'

export const BarChart: React.FC<BarChartProps> = memo(function BarChart({
	inputData,
	dimensions,
	orientation,
	hoverInfo,
	leftAxisLabel,
	bottomAxisLabel,
	checkableUnits,
	renderLegend,
	onRemoveCheckedUnit,
	treatedUnits,
	isPlaceboSimulation = false,
	checkedUnits,
}) {
	const { width, height, margin } = dimensions
	const barChartData = useData(inputData, treatedUnits, isPlaceboSimulation)
	const { inputBars, legendData } = barChartData
	const { renderAxisLabels, heightExcludingAxis, widthExcludingAxis } =
		useAxisData(
			inputBars.length,
			dimensions,
			orientation === BarChartOrientation.column,
		)

	const { xScale, yScale } = useGetScales(
		orientation,
		barChartData,
		widthExcludingAxis,
		heightExcludingAxis,
	)

	const legendGroupRef = useLegends(
		width,
		heightExcludingAxis,
		isPlaceboSimulation,
		renderAxisLabels,
		orientation,
		leftAxisLabel,
		bottomAxisLabel,
	)

	const {
		tooltip,
		handleBarMouseLeave,
		handleBarMouseClick,
		handleContainerClick,
		handleBarMouseMove,
		handleClickOutside,
	} = useHandlers(hoverInfo)

	const bars = useMemo(() => {
		return inputBars.map((ld, index) => (
			<Bar
				key={`${ld.name}@${index}`}
				className={getHoverIdFromValue(ld.name)}
				barElementClassName={BAR_ELEMENT_CLASS_NAME}
				xScale={xScale}
				yScale={yScale}
				orientation={orientation}
				height={heightExcludingAxis}
				width={widthExcludingAxis}
				widthOffset={width - widthExcludingAxis}
				data={ld}
				onMouseEnter={handleBarMouseMove}
				onMouseOut={handleBarMouseLeave}
				onClick={handleBarMouseClick}
			/>
		))
	}, [
		inputBars,
		xScale,
		yScale,
		handleBarMouseClick,
		handleBarMouseLeave,
		handleBarMouseMove,
		width,
		widthExcludingAxis,
		heightExcludingAxis,
		orientation,
	])

	return (
		<>
			<DrawingContainer
				className="bar-chart"
				width={width}
				height={height}
				margin={margin}
				handleClickOutside={handleClickOutside}
				handleContainerClick={handleContainerClick}
			>
				<BarChartAxis
					type={AxisType.Left}
					xScale={xScale}
					yScale={yScale}
					barQuantity={inputBars.length}
					dimensions={dimensions}
					orientation={orientation}
				/>
				<BarChartAxis
					type={AxisType.Bottom}
					xScale={xScale}
					yScale={yScale}
					barQuantity={inputBars.length}
					dimensions={dimensions}
					orientation={orientation}
				/>
				{bars}
				<g ref={legendGroupRef} />
			</DrawingContainer>
			{renderLegend && <Legend data={legendData} />}
			<ChartTooltip
				tooltip={tooltip}
				checkedUnits={checkedUnits}
				checkableUnits={checkableUnits}
				onRemoveCheckedUnit={onRemoveCheckedUnit}
			/>
		</>
	)
})
