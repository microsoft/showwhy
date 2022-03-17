/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import { useEffect, useMemo, useState } from 'react'

const DETAILS_WIDTH_PERCENTAGE_MAX = 0.17
const DETAILS_WIDTH_PERCENTAGE_MIN = 0.12

export function useWindowDimensions(): Dimensions {
	const [windowDimensions, setWindowDimensions] = useState({
		width: 0,
		height: 0,
	})
	useEffect(() => {
		function handleResize() {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener('resize', handleResize)
		handleResize()
		return () => window.removeEventListener('resize', handleResize)
	}, [])
	return windowDimensions
}

export function useVegaWindowDimensions(): Dimensions {
	const size = useWindowDimensions()
	console.log('size', size)
	return useVegaWindowDimensionsTestable(size)
}

export function useVegaWindowDimensionsTestable(
	windowSize: Dimensions,
): Dimensions {
	return useMemo(() => {
		let percentage = DETAILS_WIDTH_PERCENTAGE_MAX * 2
		if (windowSize.width < 1200) {
			percentage = DETAILS_WIDTH_PERCENTAGE_MIN * 3.5
		}
		const detailsWidth = window.innerWidth * percentage

		return {
			width: window.innerWidth - detailsWidth,
			height: window.innerHeight / 2,
		}
	}, [windowSize])
}
