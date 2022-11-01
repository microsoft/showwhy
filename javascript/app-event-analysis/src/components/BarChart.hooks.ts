/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { max, min, select } from 'd3'
import { useEffect, useMemo, useRef } from 'react'

import type { BarData, LegendData } from '../types'
import { BarChartOrientation } from '../types'
import { getColor } from './BarChart.utils.js'

const axisFontSize = '14px'

export function useColors() {
	const theme = useThematic()
	return useMemo(() => getColor(theme), [theme])
}

export function useData(
	inputData: BarData[],
	treatedUnits: string[],
	isPlaceboSimulation: boolean,
): {
	inputBars: BarData[]
	barNames: string[]
	minValue: number
	maxValue: number
	legendData: LegendData[]
} {
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
