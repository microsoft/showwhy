/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function percentage(completed = 0, total = 0): number {
	return Math.min(+((100 * completed) / total || 0).toFixed(2), 100)
}

export function median(values: number[]): number {
	if (values.length === 0) return 0

	values.sort(function (a, b) {
		return a - b
	})

	const half = Math.floor(values.length / 2)

	if (values.length % 2) return values[half]!

	return (values[half - 1]! + values[half]!) / 2.0
}
