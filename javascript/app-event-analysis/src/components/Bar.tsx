/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { select } from 'd3'
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react'

import type { BarData, D3ScaleBand, D3ScaleLinear } from '../types.js'
import { BAR_TRANSPARENT, BarChartOrientation } from '../types.js'
import type { BarProps } from './Bar.types.js'

export const Bar: React.FC<BarProps> = memo(function Bar({
	barElementClassName,
	xScale,
	yScale,
	orientation,
	width,
	widthOffset,
	height,
	color,
	data,
	renderRotatedLabel,
	...props
}) {
	const ref = useRef<SVGRectElement | null>(null)
	const theme = useThematic()
	const isColumn = useMemo<boolean>(
		() => orientation === BarChartOrientation.column,
		[orientation],
	)

	const getXOffset = useCallback(
		(d: BarData): number => {
			return isColumn ? (xScale as D3ScaleBand)(d.name) ?? 0 : widthOffset
		},
		[isColumn, widthOffset, xScale],
	)

	const getYOffset = useCallback(
		(d: BarData): number => {
			return isColumn
				? (yScale as D3ScaleLinear)(d.value)
				: (yScale as D3ScaleBand)(d.name) ?? 0
		},
		[isColumn, yScale],
	)

	const getTransform = useCallback(
		(d: BarData): string => {
			const xOffset = getXOffset(d)
			const yOffset = getYOffset(d)
			return `translate(${xOffset}, ${yOffset})`
		},
		[getXOffset, getYOffset],
	)

	const bandWidth = useMemo(
		() => ((isColumn ? xScale : yScale) as D3ScaleBand).bandwidth(),
		[isColumn, xScale, yScale],
	)

	const renderBar = useCallback(() => {
		const textColor = theme.text().fill().hex()
		if (ref.current) {
			const barElement = select<SVGGElement, BarData>(ref.current).datum(data)
			barElement.selectAll('*').remove()
			barElement
				.attr('transform', getTransform)
				.attr('class', barElementClassName)
				.attr('stroke', 'none')
				.attr('opacity', d => d.opacity || BAR_TRANSPARENT)
				.style('fill', d => d.color)

			if (renderRotatedLabel) {
				barElement
					.append('text')
					.text(d => d.name ?? '')
					.attr('transform', function (d) {
						const xText = bandWidth * 0.25
						return `translate(${xText}, 0) rotate(90)`
					})
					.attr('fill', textColor)
					.attr('font-size', 'x-small')
			}
			if (isColumn) {
				barElement.attr('width', bandWidth).attr('height', d => {
					const value = (yScale as D3ScaleLinear)(Math.abs(d.value))
					return height - value
				})
			} else {
				barElement
					.attr('width', d => (xScale as D3ScaleLinear)(d.value))
					.attr('height', bandWidth)
			}
		}
	}, [
		theme,
		isColumn,
		bandWidth,
		getTransform,
		data,
		xScale,
		yScale,
		height,
		renderRotatedLabel,
		barElementClassName,
	])

	useLayoutEffect(() => {
		renderBar()
	}, [
		renderBar,
		data,
		xScale,
		yScale,
		orientation,
		widthOffset,
		width,
		height,
		color,
		renderRotatedLabel,
	])

	return <rect ref={ref} {...props} />
})
