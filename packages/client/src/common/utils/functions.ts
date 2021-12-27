/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~enums'
import { CheckStatus } from '~interfaces'

export function replaceItemAtIndex<T>(
	arr: T[],
	index: number,
	newValue: T,
): T[] {
	return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const sortGroupByKey = (key: string, asc = true) => {
	return <T>(a: T, b: T): number => {
		const aValue = isNaN(a[key]) ? a[key] : +a[key]
		const bValue = isNaN(b[key]) ? b[key] : +b[key]
		if (aValue > bValue) return 1 * (asc ? 1 : -1)
		else if (aValue < bValue) return -1 * (asc ? 1 : -1)
		else return 0
	}
}

export const addS = (len: number): string => {
	return len !== 1 ? 's' : ''
}

export function addOrRemoveArrayElement(
	array: string[],
	item: string,
	add: boolean,
): string[] {
	if (add) {
		return [...array, item]
	}
	return array.filter(d => d !== item)
}

export const findRunError = (
	response: Partial<CheckStatus>,
): string | undefined => {
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

export const wait = (ms: number): Promise<boolean> => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, ms)
	})
}

export const equalArrays = (arr1: any[], arr2: any[]): boolean => {
	if (arr1.length !== arr2.length) {
		return false
	}
	return arr1.every(item => arr2.includes(item))
}

export const calculateMedian = (values: number[]): number => {
	if (values.length === 0) return 0

	values.sort(function (a, b) {
		return a - b
	})

	const half = Math.floor(values.length / 2)

	if (values.length % 2) return values[half]

	return (values[half - 1] + values[half]) / 2.0
}

export const returnElapsedTime = (startDate: Date, endDate: Date): string => {
	const diffInMilliSeconds = endDate.valueOf() - startDate.valueOf()
	const minutes = Math.floor(diffInMilliSeconds / 1000 / 60)
	const seconds = Math.floor((diffInMilliSeconds / 1000) % 60)
		.toString()
		.padStart(2, '0')
	return `${minutes}min ${seconds}s`
}

export const returnPercentage = (completed: number, total: number): number => {
	return Math.min(+((100 * completed) / total).toFixed(2), 100)
}
