/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TimeAlignmentOptions } from '../types.js'

// @REVIEW: the following can be generalized to work with any enum
export const getKeyByValue = (value: TimeAlignmentOptions): string => {
	const index = Object.values(TimeAlignmentOptions).indexOf(value)
	return Object.keys(TimeAlignmentOptions)[index]
}

export function weightedMean(
	arrValues: number[],
	arrWeights: number[],
): number {
	const result = arrValues
		.map(function (value, i) {
			const weight = arrWeights[i]
			const sum = value * weight
			return [sum, weight]
		})
		.reduce(
			function (p, c) {
				return [p[0] + c[0], p[1] + c[1]]
			},
			[0, 0],
		)
	return result[0] / result[1]
}
