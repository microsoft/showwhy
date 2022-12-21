/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import type { ChartDimensions } from '../types.js'

const MIN_CONTAINER_HEIGHT = 800
const SCROLL_BAR_OFFSET = 30

export function useDynamicChartDimensions(
	target: React.RefObject<HTMLDivElement> | null,
	chartHeightPercent: number, // give the chart only a percentage of the total height
): ChartDimensions {
	const innerOuterHeightDiff = useRef(0)
	const { width = 1 } = useResizeObserver<HTMLDivElement>({
		ref: target,
	})

	const chartDimensions = {
		width: 0,
		height: 0,
		margin: {
			top: 1,
			right: 100,
			bottom: 50,
			left: 100,
		},
	}

	const containerHeight = Math.max(MIN_CONTAINER_HEIGHT, window.innerHeight)
	const chartHeight = containerHeight * chartHeightPercent

	if (innerOuterHeightDiff.current === 0) {
		innerOuterHeightDiff.current = window.outerHeight - window.innerHeight
	}

	return {
		width:
			width -
			SCROLL_BAR_OFFSET -
			chartDimensions.margin.right -
			chartDimensions.margin.left,
		height:
			chartHeight - chartDimensions.margin.top - chartDimensions.margin.bottom,
		margin: {
			top: 1,
			right: 100,
			bottom: 50,
			left: 100,
		},
	}
}
