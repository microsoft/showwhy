/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'

import type { Map } from '../hooks/useTreatedUnitsMap'
import type { LineData } from '../types.js'
import {
	HIGHLIGHT_LINE,
	LINE_ELEMENT_CLASS_NAME,
	LINE_WIDTH,
	LINE_WIDTH_TREATED,
	TRANSPARENT_LINE,
} from '../types.js'
import { getHoverIdFromValue } from '../utils/charts.js'
import { useLineColors } from '../utils/useColors.js'

export function useLinePropsGetters(treatedUnitsMap: Map) {
	const getColor = useGetColor(treatedUnitsMap)
	const getOpacity = useGetOpacity(treatedUnitsMap)
	const getStrokeWidth = useGetStrokeWidth(treatedUnitsMap)
	return useMemo(() => {
		return {
			getClassName,
			getColor,
			getOpacity,
			getStrokeWidth,
		}
	}, [getColor, getOpacity, getStrokeWidth])
}

function getClassName(lineData: LineData[]) {
	return `${LINE_ELEMENT_CLASS_NAME} ${getHoverIdFromValue(lineData[0].unit)}`
}

function useGetColor(treatedUnitsMap: Map) {
	const colors = useLineColors()
	return useCallback(
		(lineData: LineData[]) => {
			return treatedUnitsMap[lineData[lineData.length - 1].unit]
				? colors.get('treated')
				: colors.control
		},
		[colors, treatedUnitsMap],
	)
}

function useGetOpacity(treatedUnitsMap: Map) {
	return useCallback(
		(lineData: LineData[]) => {
			return treatedUnitsMap[lineData[lineData.length - 1].unit]
				? HIGHLIGHT_LINE
				: TRANSPARENT_LINE
		},
		[treatedUnitsMap],
	)
}

function useGetStrokeWidth(treatedUnitsMap: Map) {
	return useCallback(
		(lineData: LineData[]) => {
			return treatedUnitsMap[lineData[lineData.length - 1].unit]
				? LINE_WIDTH_TREATED
				: LINE_WIDTH
		},
		[treatedUnitsMap],
	)
}
