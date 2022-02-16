/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function wait(ms: number): Promise<boolean> {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, ms)
	})
}

export function returnElapsedTime(
	startDate: Date | string,
	endDate: Date | string,
): string {
	if (typeof startDate === 'string') {
		startDate = new Date(startDate)
	}

	if (typeof endDate === 'string') {
		endDate = new Date(endDate)
	}

	const diffInMilliSeconds = endDate.valueOf() - startDate.valueOf()
	const minutes = Math.floor(diffInMilliSeconds / 1000 / 60)
	const seconds = Math.floor((diffInMilliSeconds / 1000) % 60)
		.toString()
		.padStart(2, '0')
	return `${minutes}min ${seconds}s`
}
