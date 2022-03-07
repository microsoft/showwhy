/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex-js-toolkit/hooks'
import { useState, useEffect, useMemo } from 'react'

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
	return useVegaWindowDimensionsTestable(size)
}

export function useVegaWindowDimensionsTestable(
	windowSize: Dimensions,
): Dimensions {
	return useMemo(() => {
		let percentage = 3.5
		if (windowSize.width >= 1800) {
			percentage = 2.3
		} else if (windowSize.width >= 1600) {
			percentage = 2.4
		} else if (windowSize.width >= 1400) {
			percentage = 2.5
		} else if (windowSize.width >= 1200) {
			percentage = 2.7
		} else if (windowSize.width >= 1096) {
			percentage = 2.9
		}

		return {
			width: window.innerWidth / percentage,
			height: window.innerHeight / 2,
		}
	}, [windowSize])
}
