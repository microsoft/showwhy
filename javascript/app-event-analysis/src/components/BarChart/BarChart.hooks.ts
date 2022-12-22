/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useDebounceFn } from 'ahooks'
import { max, min, scaleBand, scaleLinear, select, selectAll } from 'd3'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import type { ShowTooltip } from '../../hooks/useTooltip.js'
import { useTooltip } from '../../hooks/useTooltip.js'
import type {
	BarData,
	D3ScaleBand,
	D3ScaleLinear,
	HoverInfo,
	LegendData,
	TooltipInfo,
} from '../../types'
import {
	BAR_ELEMENT_CLASS_NAME,
	BAR_GAP,
	BAR_NORMAL,
	BAR_TRANSPARENT,
	BarChartOrientation,
} from '../../types'
import type { BarChartData } from './BarChart.types.js'
import { constructBarTooltipContent, getColor } from './BarChart.utils.js'

const axisFontSize = '14px'

export function useColors() {
	const theme = useThematic()
	return useMemo(() => getColor(theme), [theme])
}

export function useData(
	inputData: BarData[],
	treatedUnits: string[],
	isPlaceboSimulation: boolean,
): BarChartData {
	const colors = useColors()
	const treatedUnit = inputData.find(element =>
		treatedUnits.some(unit => element.name.includes(unit)),
	)

	const treatedUnitLegend = useMemo<LegendData>(() => {
		const isNegative = (treatedUnit?.label ?? 0) < 0
		return {
			name: `Treated unit with ${isNegative ? 'negative' : 'positive'} effect`,
			color: colors.get(isNegative ? 'negative' : 'normal'),
		}
	}, [colors, treatedUnit])
	return useMemo(() => {
		const inputBars: BarData[] = []
		let color = colors.get('control-units')
		const opacity = {
			treatedUnit: 1,
			unit: 0.7,
		}

		inputData.forEach(element => {
			if (isPlaceboSimulation) {
				color =
					(element.label as number) < 0
						? colors.get('negative')
						: colors.get('normal')
			}
			inputBars.push({
				name: element.name,
				value: element.value,
				label: element.label,
				color,
				opacity:
					element.name === treatedUnit?.name
						? opacity.treatedUnit
						: opacity.unit,
			})
		})

		const legendData = !isPlaceboSimulation
			? [
					{
						name: 'Control units',
						color: colors.get('control-units'),
					},
			  ]
			: [
					{
						name: 'Placebo unit with negative effect',
						color: colors.get('negative'),
						opacity: opacity.unit,
					},
					{
						name: 'Placebo unit with positive effect',
						color: colors.get('normal'),
						opacity: opacity.unit,
					},
					treatedUnitLegend,
			  ]

		const allValues = inputData.map(dataElement => dataElement.value)
		const minValue = min(allValues) ?? 0
		const maxValue = max(allValues) ?? 1

		const barNames = inputData.map(dataElement => dataElement.name)

		return {
			inputBars,
			barNames,
			minValue,
			maxValue,
			legendData,
		}
	}, [colors, treatedUnit, treatedUnitLegend, inputData, isPlaceboSimulation])
}

export function useGetScales(
	orientation: BarChartOrientation,
	barChartData: BarChartData,
	widthExcludingAxis: number,
	heightExcludingAxis: number,
): {
	xScale: D3ScaleLinear | D3ScaleBand
	yScale: D3ScaleLinear | D3ScaleBand
} {
	return useMemo(() => {
		const { minValue, maxValue, barNames } = barChartData
		const xScale =
			orientation === BarChartOrientation.column
				? scaleBand()
						.domain(barNames)
						.range([0, widthExcludingAxis])
						.padding(BAR_GAP)
				: scaleLinear()
						.domain([minValue > 0 ? 0 : minValue, maxValue]) // ensure that axis starts at 0
						.range([0, widthExcludingAxis])

		const yScale =
			orientation === BarChartOrientation.column
				? scaleLinear()
						.domain([minValue > 0 ? 0 : minValue, maxValue]) // ensure that axis starts at 0
						.range([heightExcludingAxis, 0])
				: scaleBand()
						.domain(barNames)
						.range([heightExcludingAxis, 0])
						.padding(BAR_GAP)
		return {
			xScale,
			yScale,
		}
	}, [barChartData, heightExcludingAxis, orientation, widthExcludingAxis])
}

export function useLegends(
	width: number,
	height: number,
	isPlaceboSimulation: boolean,
	renderAxisLabels: boolean,
	orientation: BarChartOrientation,
	leftAxisLabel: string,
	bottomAxisLabel: string,
) {
	const colors = useColors()
	const legendGroupRef = useRef(null)
	useEffect(() => {
		const container = select(legendGroupRef.current)
		container.selectAll('*').remove()

		const legendOffsetFromAxis = 25

		//
		// render bottom axis label
		//

		// text for the bottom, horizontal, axis
		const bottomAxisLabelX = width * (isPlaceboSimulation ? 0.22 : 0.45)
		const bottomAxisLabelY =
			height +
			(orientation === BarChartOrientation.row
				? legendOffsetFromAxis * 1.5
				: renderAxisLabels
				? legendOffsetFromAxis * 3.5
				: legendOffsetFromAxis)
		container
			.append('text')
			.attr('class', 'axis-name-text')
			.attr('x', bottomAxisLabelX)
			.attr('y', bottomAxisLabelY)
			.style('font-size', axisFontSize)
			.style('fill', colors.defaultAxisTitle)
			.text(bottomAxisLabel)
		// add background rect for the bottom axis' text
		container
			.append('rect')
			.attr('class', 'axis-name-text-bkgnd-rect')
			.style('fill', colors.axisBackground)
			.attr('x', bottomAxisLabelX)
			.attr('y', bottomAxisLabelY)
			.attr('width', 10)
			.attr('height', 10)
		// calculate the bbox for the axis text and update the rect
		container.each(function () {
			const rect = select(this).select('.axis-name-text-bkgnd-rect')
			const text = select(this).select('.axis-name-text')
			const textNode = text.node() as SVGGraphicsElement
			const textBBox = textNode.getBBox()
			rect
				.attr('x', textBBox.x)
				.attr('y', textBBox.y)
				.attr('width', textBBox.width)
				.attr('height', textBBox.height)
			text.raise()
		})

		//
		// render left axis label
		//

		const leftAxisLabelX = renderAxisLabels
			? legendOffsetFromAxis * 2.5
			: legendOffsetFromAxis
		const leftAxisLabelY = height / 2
		container
			.append('g')
			.attr('transform', `translate(${-leftAxisLabelX}, ${leftAxisLabelY})`)
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'rotate(-90)')
			.style('font-size', axisFontSize)
			.style('fill', colors.defaultAxisTitle)
			.text(leftAxisLabel)
	}, [
		colors,
		isPlaceboSimulation,
		height,
		width,
		renderAxisLabels,
		orientation,
		leftAxisLabel,
		bottomAxisLabel,
	])
	return legendGroupRef
}

export function useHandlers(hoverInfo: HoverInfo) {
	const tooltip = useTooltip()
	const {
		show: showTooltip,
		hide: hideTooltip,
		stick: persistTooltip,
	} = tooltip

	const updateTooltip = useUpdateTooltip(showTooltip, hoverInfo)
	const mouseLeaveHandler = useHandleBarMouseLeave(hideTooltip, hoverInfo)
	const handleContainerClick = useHandleContainerClick(hideTooltip)
	const handleBarMouseClick = useHandleBarMouseClick(
		persistTooltip,
		updateTooltip,
	)
	const { run: handleBarMouseMove } = useDebounceFn(
		(event: React.MouseEvent) => updateTooltip(event),
		{
			wait: 250,
		},
	)
	const { run: handleBarMouseLeave } = useDebounceFn(
		(event: React.MouseEvent) => mouseLeaveHandler(event),
		{
			wait: 250,
		},
	)

	return useMemo(() => {
		return {
			tooltip,
			handleBarMouseLeave,
			handleBarMouseClick,
			handleContainerClick,
			handleBarMouseMove,
			handleClickOutside: () => hideTooltip(true),
		}
	}, [
		tooltip,
		hideTooltip,
		handleBarMouseMove,
		handleBarMouseLeave,
		handleBarMouseClick,
		handleContainerClick,
	])
}

function useUpdateTooltip(showTooltip: ShowTooltip, hoverInfo: HoverInfo) {
	return useCallback(
		(event: React.MouseEvent, force = false) => {
			const bar = select<SVGElement, BarData>(event.target as SVGElement)
			const data: BarData = bar.datum() // a single bar data
			const xPos = event.clientX
			const yPos = event.clientY
			const toolTipContent: { content: JSX.Element; unit: string } =
				constructBarTooltipContent(data)
			showTooltip({
				contentEl: toolTipContent.content,
				xPos,
				yPos,
				options: {
					unit: toolTipContent.unit,
					force: force,
				},
			})
			bar.attr('opacity', BAR_NORMAL)

			hoverInfo.setHoverItem({
				data,
				xPos,
				yPos,
			} as TooltipInfo)
		},
		[showTooltip, hoverInfo],
	)
}

function useHandleBarMouseClick(
	persistTooltip: () => void,
	updateTooltip: (event: React.MouseEvent, force: boolean) => void,
) {
	return useCallback(
		(event: React.MouseEvent<SVGElement>) => {
			updateTooltip(event, true)
			persistTooltip()
		},
		[persistTooltip, updateTooltip],
	)
}

function useHandleBarMouseLeave(
	hideTooltip: (force?: boolean) => void,
	hoverInfo: HoverInfo,
) {
	return useCallback(
		(event: React.MouseEvent) => {
			hideTooltip()

			const bar = select<SVGElement, BarData>(event.target as SVGElement)
			const data: BarData = bar.datum() // a single bar data
			bar.attr('opacity', data.opacity || BAR_TRANSPARENT)
			selectAll('.bar').attr(
				'opacity',
				d => (d as BarData).opacity || BAR_TRANSPARENT,
			)

			hoverInfo.setHoverItem({
				data,
				xPos: 0,
				yPos: 0,
				isPreviousHover: true,
			} as TooltipInfo)
		},
		[hideTooltip, hoverInfo],
	)
}

function useHandleContainerClick(hideTooltip: (force?: boolean) => void) {
	return useCallback(
		(event: React.MouseEvent) => {
			const element = event.target as Element
			if (!element.classList.contains(BAR_ELEMENT_CLASS_NAME)) {
				hideTooltip(true)
			}
		},
		[hideTooltip],
	)
}
