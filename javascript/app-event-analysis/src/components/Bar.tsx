/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import * as d3 from 'd3'
import {
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react'

import type { BarData, D3ScaleBand, D3ScaleLinear } from '../types.js'
import { BAR_TRANSPARENT, BarChartOrientation } from '../types.js'
import type { BarProps } from './Bar.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = d3.easeLinear

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
	animation,
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

	const getWidth = useCallback(
		(d: BarData) => {
			return isColumn ? bandWidth : (xScale as D3ScaleLinear)(d.value)
		},
		[isColumn, bandWidth, xScale],
	)

	const getHeight = useCallback(
		(d: BarData) => {
			return isColumn ? (yScale as D3ScaleLinear)(Math.abs(d.value)) : bandWidth
		},
		[bandWidth, isColumn, yScale],
	)

	const renderBar = useCallback(() => {
		const textColor = theme.text().fill().hex()
		if (ref.current) {
			const barElement = d3
				.select<SVGGElement, BarData>(ref.current)
				.datum(data)
			barElement.selectAll('*').remove()
			barElement
				.attr('transform', getTransform)
				// .attr('height', getHeight)
				.attr('width', getWidth)
				.attr('class', barElementClassName)
				.attr('stroke', 'none')
				.attr('opacity', d => d.opacity || BAR_TRANSPARENT)
				.style('fill', d => d.color)

			if (animation) {
				barElement.transition().duration(ANIMATION_DURATION).ease(EASING_FN)
			}
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
				barElement
					// .attr('width', bandWidth)
					.attr('height', d => {
						const value = (yScale as D3ScaleLinear)(Math.abs(d.value))
						return height - value
					})
			} else {
				barElement
					// .attr('width', d => (xScale as D3ScaleLinear)(d.value))
					.attr('height', bandWidth)
			}
		}
	}, [
		theme,
		isColumn,
		data,
		xScale,
		yScale,
		height,
		renderRotatedLabel,
		animation,
		barElementClassName,
	])

	useLayoutEffect(() => {
		// useEffect(() => {
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
		animation,
		renderRotatedLabel,
	])

	return <rect ref={ref} {...props} />
})
