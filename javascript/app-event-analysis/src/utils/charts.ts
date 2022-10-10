/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BarData, LineData } from '../types.js'

export const getUnitFromBarChartData = (data: BarData) => {
	return data.name
}

export const getUnitFromLineChartData = (data: LineData[]) => {
	return data.length ? data[0].unit : 'unknown-unit'
}

export function isBarChartData(data: BarData | LineData[]): data is BarData {
	return (data as BarData).name !== undefined
}

export function getHoverIdFromValue(hoverValue: string) {
	// remove dots/spaces from the string since it will conflict with the d3 selected later on
	let hoverValueNoDots = hoverValue.split('.').join('')
	hoverValueNoDots = hoverValueNoDots.split(',').join('')
	hoverValueNoDots = hoverValueNoDots.split('[').join('')
	hoverValueNoDots = hoverValueNoDots.split(']').join('')
	hoverValueNoDots = hoverValueNoDots.split('-').join('')
	hoverValueNoDots = hoverValueNoDots.split("'").join('')
	hoverValueNoDots = hoverValueNoDots.split('&').join('')
	hoverValueNoDots = hoverValueNoDots.split('(').join('')
	hoverValueNoDots = hoverValueNoDots.split(')').join('')
	return hoverValueNoDots.split(' ').join('')
}
