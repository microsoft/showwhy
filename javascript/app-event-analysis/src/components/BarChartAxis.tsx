/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'

import { useAxisData } from '../hooks/useAxisData.js'
import { BarChartOrientation, D3ScaleBand, D3ScaleLinear } from '../types.js'
import { Axis } from './Axis.js'
import { AxisType } from './Axis.types.js'
import type { BarChartAxisProps } from './BarChartAxis.types.js'

const TICKS = 5

export const BarChartAxis: React.FC<BarChartAxisProps> = memo(
	function BarChartAxis({
		type,
		xScale,
		yScale,
		barQuantity,
		dimensions,
		orientation,
	}) {
		const isColumn = useMemo<boolean>(
			() => orientation === BarChartOrientation.column,
			[orientation],
		)
		const isBottomAxis = useMemo<boolean>(
			() => type === AxisType.Bottom,
			[type],
		)
		const { width } = dimensions
		const { renderAxisLabels, heightExcludingAxis, widthExcludingAxis } =
			useAxisData(barQuantity, dimensions, isColumn)

		const bottomAxisTransform = useMemo<string>(() => {
			const xOffset = isColumn ? 0 : width - widthExcludingAxis
			const yOffset = heightExcludingAxis
			return `translate(${xOffset}, ${yOffset})`
		}, [isColumn, width, widthExcludingAxis, heightExcludingAxis])

		const leftAxisTransform = useMemo<string | undefined>(() => {
			const xOffset = width - widthExcludingAxis
			const yOffset = 0
			return isColumn ? undefined : `translate(${xOffset}, ${yOffset})`
		}, [isColumn, width, widthExcludingAxis])

		const transform = useMemo<string | undefined>(() => {
			if (isBottomAxis) {
				return bottomAxisTransform
			} else {
				return leftAxisTransform
			}
		}, [isBottomAxis, bottomAxisTransform, leftAxisTransform])

		const scale = useMemo<D3ScaleLinear | D3ScaleBand>(
			() => (isBottomAxis ? xScale : yScale),
			[type],
		)

		const ticks = useMemo<number | undefined>(() => {
			if (isBottomAxis) {
				return isColumn ? undefined : TICKS
			} else {
				return isColumn ? TICKS : undefined
			}
		}, [isBottomAxis, isColumn])

		const renderLabels = useMemo<boolean | undefined>(() => {
			if (isBottomAxis) {
				return isColumn ? renderAxisLabels : undefined
			} else {
				return isColumn ? undefined : renderAxisLabels
			}
		}, [isColumn, isBottomAxis, renderAxisLabels])

		return (
			<Axis
				type={type}
				myscale={scale}
				ticks={ticks}
				renderAxisLabels={renderLabels}
				transform={transform}
			/>
		)
	},
)
