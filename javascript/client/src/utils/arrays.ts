/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function replaceItemAtIndex<T>(
	arr: T[],
	index: number,
	newValue: T,
): T[] {
	return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export function addOrRemoveArrayElement(
	array: string[],
	item: string,
	add: boolean,
): string[] {
	return add ? [...array, item] : array.filter(d => d !== item)
}
