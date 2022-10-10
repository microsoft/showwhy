/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLayoutEffect, useRef, useState } from 'react'

import type { PlaceboDataGroup, SynthControlData } from '../types.js'
import type { ChartDimensions } from './ResultPane.types.js'

const MIN_CONTAINER_HEIGHT = 800
const SCROLL_BAR_OFFSET = 30

export function useDynamicChartDimensions(
	target: React.RefObject<HTMLDivElement> | null,
	chartHeightPercent: number, // give the chart only a percentage of the total height
	data: SynthControlData | Map<string, PlaceboDataGroup[]> | null,
): ChartDimensions {
	const widthDiff = useRef(0)
	const heightDiff = useRef(0)
	const innerOuterHeightDiff = useRef(0)

	const [chartDimensions, setChartDimensions] = useState<ChartDimensions>({
		width: 0,
		height: 0,
		margin: {
			top: 0,
			right: 100,
			bottom: 50,
			left: 100,
		},
	})

	useLayoutEffect(() => {
		let resizedFn: ReturnType<typeof setTimeout>
		function handleResize() {
			clearTimeout(resizedFn)
			resizedFn = setTimeout(() => {
				// retrieve the chart's width from the parent
				if (!target || !target.current || !target.current.parentElement) return
				const newWidth = target.current.parentElement.offsetWidth

				// cache the original chart's width/height
				// to be later considered when the browser window is resized
				if (widthDiff.current === 0) {
					widthDiff.current = window.innerWidth - newWidth
				}
				if (heightDiff.current === 0) {
					heightDiff.current = window.innerHeight * (1 - chartHeightPercent)
				}

				// cache the difference between the window outer and inner height
				if (innerOuterHeightDiff.current === 0) {
					innerOuterHeightDiff.current = window.outerHeight - window.innerHeight
				}

				const containerHeight = Math.max(
					MIN_CONTAINER_HEIGHT,
					window.outerHeight - innerOuterHeightDiff.current,
				)
				const chartHeight = containerHeight * chartHeightPercent

				setChartDimensions((chartDimensions: ChartDimensions) => ({
					...chartDimensions,
					width:
						window.outerWidth -
						SCROLL_BAR_OFFSET -
						widthDiff.current -
						chartDimensions.margin.right -
						chartDimensions.margin.left,
					height:
						chartHeight -
						chartDimensions.margin.top -
						chartDimensions.margin.bottom,
				}))
			}, 250)
		}

		window.addEventListener('resize', handleResize)

		// onMount --> set initial chart width/height
		handleResize()

		// onUnmount --> clean the resize event handler
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [target, chartHeightPercent, data])

	return chartDimensions
}
