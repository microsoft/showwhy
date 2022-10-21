/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import * as d3 from 'd3'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import * as ReactDOM from 'react-dom'
import { useRecoilState } from 'recoil'

import { useShowPlaceboGraphs } from '../hooks/useShowPlaceboGraphs.js'
import { useTooltip } from '../hooks/useTooltip'
import { CheckedUnitsState, TreatedUnitsState } from '../state/state.js'
import type { BarData, TooltipInfo } from '../types.js'
import {
	BAR_GAP,
	BAR_NORMAL,
	BAR_TRANSPARENT,
	BarChartOrientation,
	MAX_BAR_COUNT_WITH_VISIBLE_LABELS,
} from '../types.js'
import {
	getHoverIdFromValue,
	getUnitFromLineChartData,
	isBarChartData,
} from '../utils/charts.js'
import { Axis } from './Axis.js'
import { Bar } from './Bar.js'
import { useData, useLegends } from './BarChart.hooks.js'
import { TooltipContent } from './BarChart.styles.js'
import type { BarChartProps } from './BarChart.types.js'
import { constructBarTooltipContent } from './BarChart.utils.js'
import { DrawingContainer } from './DrawingContainer.js'
import { ToolTip } from './ToolTip.js'

const BAR_ELEMENT_CLASS_NAME = 'bar'

export const BarChart: React.FC<BarChartProps> = memo(function BarChart({
	inputData,
	dimensions,
	orientation,
	hoverInfo,
	leftAxisLabel,
	bottomAxisLabel,
	checkableUnits,
	onRemoveCheckedUnit,
}) {
	const { width, height, margin } = dimensions
	const [treatedUnits] = useRecoilState(TreatedUnitsState)
	const isPlaceboSimulation = useShowPlaceboGraphs()
	const [checkedUnits] = useRecoilState(CheckedUnitsState)

	const { inputBars, minValue, maxValue, barNames } = useData(
		inputData,
		treatedUnits,
		isPlaceboSimulation,
	)

	//
	// @REVIEW
	//
	// when the number of bars is too big, bar size would be scaled smaller and labels will overlap
	//  one quick solution is to disable displaying bars and labels after some thershold
	//  another solution involves allowing a fixed-size bar and scroll the bar-chart area
	//
	// current, temp, solution is to hide the labels after exceeding a thershold for bars count
	//
	const renderAxisLabels = useMemo(() => {
		return (
			inputBars.length <=
			(orientation === BarChartOrientation.column
				? MAX_BAR_COUNT_WITH_VISIBLE_LABELS * 2
				: MAX_BAR_COUNT_WITH_VISIBLE_LABELS)
		)
	}, [inputBars, orientation])

	const heightExcludingAxis =
		orientation === BarChartOrientation.column ? height * 0.75 : height
	const widthExcludingAxis =
		orientation === BarChartOrientation.column
			? width
			: renderAxisLabels
			? width * 0.9
			: width

	const { xScale, yScale } = useMemo(() => {
		const xScale =
			orientation === BarChartOrientation.column
				? d3
						.scaleBand()
						.domain(barNames)
						.range([0, widthExcludingAxis])
						.padding(BAR_GAP)
				: d3
						.scaleLinear()
						.domain([minValue > 0 ? 0 : minValue, maxValue]) // ensure that axis starts at 0
						.range([0, widthExcludingAxis])

		const yScale =
			orientation === BarChartOrientation.column
				? d3
						.scaleLinear()
						.domain([minValue > 0 ? 0 : minValue, maxValue]) // ensure that axis starts at 0
						.range([heightExcludingAxis, 0])
				: d3
						.scaleBand()
						.domain(barNames)
						.range([heightExcludingAxis, 0])
						.padding(BAR_GAP)

		return {
			xScale,
			yScale,
		}
	}, [
		minValue,
		maxValue,
		heightExcludingAxis,
		widthExcludingAxis,
		barNames,
		orientation,
	])

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
			const chart = d3.select('.bar-chart')

			// hoverInfo.hoverItem is not null but it may have data of type BarData | LineData[]
			// re-construct the hoverItem to align with the current chart type
			// i.e., convert LineData[] to BarData as necessary
			if (!isBarChartData(hoverInfo.hoverItem.data)) {
				//
				// hover interaction has originated from LineChart
				//
				const unit = getUnitFromLineChartData(hoverInfo.hoverItem.data)
				// find the bar data that corresponds to unit then use it to show the tooltip
				const barIndex = inputBars.findIndex(bar => bar.name === unit)
				if (barIndex < 0) return

				const data = inputBars[barIndex]
				const targetBar = chart.select<SVGRectElement>(
					'.' + getHoverIdFromValue(unit),
				)
				if (targetBar) {
					if (hoverInfo.hoverItem.isPreviousHover) {
						hideTooltip()
						targetBar.select('.bar').attr('opacity', BAR_TRANSPARENT)
					} else {
						const targetBarNode = targetBar.node()
						if (targetBarNode) {
							const targetBarBoundingRect =
								targetBarNode.getBoundingClientRect()
							const xPos = targetBarBoundingRect.x
							const yPos = targetBarBoundingRect.y
							const toolTipContent: { content: JSX.Element; unit: string } =
								constructBarTooltipContent(data as BarData)
							showTooltip(toolTipContent.content, xPos, yPos, {
								unit: toolTipContent.unit,
								force: false,
							})
						}
						targetBar.select('.bar').attr('opacity', BAR_NORMAL)
					}
				}
			} else {
				// do nothing becasue the event has originated from the same chart
				//  and has been handled by the mouse move/leave event(s)
			}
		}
	}, [hoverInfo, hideTooltip, showTooltip, inputBars])

	const legendGroupRef = useLegends(
		width,
		heightExcludingAxis,
		isPlaceboSimulation,
		renderAxisLabels,
		orientation,
		leftAxisLabel,
		bottomAxisLabel,
	)

	const updateTooltip = useCallback(
		(event: React.MouseEvent<SVGElement>, force = false) => {
			const bar = d3.select<SVGElement, BarData>(event.target as SVGElement)
			const data: BarData = bar.datum() // a single bar data
			const xPos = event.clientX
			const yPos = event.clientY
			const toolTipContent: { content: JSX.Element; unit: string } =
				constructBarTooltipContent(data)
			showTooltip(toolTipContent.content, xPos, yPos, {
				unit: toolTipContent.unit,
				force: force,
			})
			bar.attr('opacity', BAR_NORMAL)

			ReactDOM.flushSync(() => {
				// this setState won't be batched
				hoverInfo.setHoverItem({
					data: data,
					xPos: xPos,
					yPos: yPos,
				} as TooltipInfo)
			})
		},
		[showTooltip, hoverInfo],
	)

	const handleBarMouseMove = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			updateTooltip(event)
		},
		[updateTooltip],
	)

	const handleBarMouseClick = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			updateTooltip(event, true)
			persistTooltip()
		},
		[persistTooltip, updateTooltip],
	)

	const handleBarMouseLeave = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			hideTooltip()
			d3.selectAll('.bar').attr('opacity', BAR_TRANSPARENT)

			const bar = d3.select<SVGElement, BarData>(event.target as SVGElement)
			const data: BarData = bar.datum() // a single bar data
			ReactDOM.flushSync(() => {
				// this setState won't be batched
				hoverInfo.setHoverItem({
					data: data,
					xPos: 0,
					yPos: 0,
					isPreviousHover: true,
				} as TooltipInfo)
			})
		},
		[hideTooltip, hoverInfo],
	)

	const handleContainerClick = useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			const element = event.target as Element

			if (!element.classList.contains(BAR_ELEMENT_CLASS_NAME)) {
				hideTooltip(true)
			}
		},
		[hideTooltip],
	)

	const handleRemoveLineClick = useCallback(
		(unit: string) => {
			hideTooltip(true)
			onRemoveCheckedUnit(unit)
		},
		[onRemoveCheckedUnit, hideTooltip],
	)

	const handleTooltipRemoved = useCallback(() => {
		unPersistTooltip()
	}, [unPersistTooltip])

	const handleClickOutside = useCallback(() => {
		hideTooltip(true)
	}, [hideTooltip])

	const bars = useMemo(() => {
		return inputBars.map((ld, index) => (
			<Bar
				key={index}
				className={getHoverIdFromValue(ld.name)}
				barElementClassName={BAR_ELEMENT_CLASS_NAME}
				xScale={xScale}
				yScale={yScale}
				orientation={orientation}
				height={heightExcludingAxis}
				width={widthExcludingAxis}
				widthOffset={width - widthExcludingAxis}
				data={ld}
				renderRotatedLabel={false}
				onMouseMove={handleBarMouseMove}
				onMouseLeave={handleBarMouseLeave}
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

	const leftAxis = useMemo(() => {
		return orientation === BarChartOrientation.column ? (
			<Axis type="left" myscale={yScale} ticks={5} />
		) : (
			<Axis
				type="left"
				myscale={yScale}
				renderAxisLabels={renderAxisLabels}
				transform={`translate(${width - widthExcludingAxis}, 0)`}
			/>
		)
	}, [orientation, yScale, renderAxisLabels, width, widthExcludingAxis])

	const bottomAxis = useMemo(() => {
		return orientation === BarChartOrientation.column ? (
			<Axis
				type="bottom"
				myscale={xScale}
				renderAxisLabels={renderAxisLabels}
				transform={`translate(0, ${heightExcludingAxis})`}
			/>
		) : (
			<Axis
				type="bottom"
				myscale={xScale}
				ticks={5}
				transform={`translate(${
					width - widthExcludingAxis
				}, ${heightExcludingAxis})`}
			/>
		)
	}, [
		orientation,
		xScale,
		renderAxisLabels,
		heightExcludingAxis,
		width,
		widthExcludingAxis,
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
				{leftAxis}
				{bottomAxis}
				{bars}
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
					{isTooltipPersisted &&
						checkableUnits.includes(tooltip.unit) &&
						checkedUnits &&
						checkedUnits.has(tooltip.unit) && (
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
