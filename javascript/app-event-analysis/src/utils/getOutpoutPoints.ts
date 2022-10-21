/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SDIDOutput } from '../types.js'
import { SYNTHETIC_UNIT } from '../types.js'

export function getOutputPoints({ output, unit }: SDIDOutput) {
	// output.lines is an array of the points representing two timeseries
	//  for the treated and synthetic control units
	// so we need to cut the array in half to extract the two timeseries as two separate lines

	const linesRaw = output.lines
	const x = linesRaw.x // the x values of the merged array
	const y = linesRaw.y // the y values of the merged array
	const c = linesRaw.color

	//
	// first part is for treated
	//
	const pointsCount = x.length / 2
	const treatedPoints = []
	for (let i = 0; i < pointsCount; i++) {
		treatedPoints.push({
			date: x[i],
			value: +y[i],
			color: c[i],
			unit: unit,
			type: 'output',
		})
	}
	const controlPoints = []
	for (let i = pointsCount; i < pointsCount * 2; i++) {
		controlPoints.push({
			date: x[i],
			value: +y[i],
			color: c[i],
			unit: SYNTHETIC_UNIT + ' ' + unit,
			type: 'output',
		})
	}
	return {
		controlPoints,
		treatedPoints,
	}
}
