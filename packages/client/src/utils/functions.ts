/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EstimateEffectStatusResponse, NodeResponseStatus, Maybe } from '~types'

export function sortGroupByKey(key: string, asc = true) {
	return <T>(a: T, b: T): number => {
		const aKey = (a as any)[key]
		const bKey = (b as any)[key]
		const aValue = isNaN(aKey) ? aKey : +aKey
		const bValue = isNaN(bKey) ? bKey : +bKey
		if (aValue > bValue) return 1 * (asc ? 1 : -1)
		else if (aValue < bValue) return -1 * (asc ? 1 : -1)
		else return 0
	}
}

export function addS(len: number): string {
	return len !== 1 ? 's' : ''
}

export function findRunError(
	response: Partial<EstimateEffectStatusResponse>,
): Maybe<string> {
	if (response.runtimeStatus?.toLowerCase() === NodeResponseStatus.Failed) {
		const error =
			response.partial_results &&
			response.partial_results.find(r => r.state === NodeResponseStatus.Failed)
		const errorMessage = !!error
			? error?.traceback || error?.error
			: (response?.output as string) ||
			  'Undefined error. Please, execute the run again.'
		console.log('Traceback:', errorMessage)
		return errorMessage
	}
	return undefined
}

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
