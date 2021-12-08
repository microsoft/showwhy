/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Adds or removes an array element based on the add boolean
 * @param array
 * @param item
 * @param add
 * @returns
 */
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

/**
 * Rounds a number to the specified decimal places.
 * @param num
 * @param places
 * @returns
 */
export function round(num: number, places: number): number {
	const rounder = Math.pow(10, places)
	return Math.round(num * rounder) / rounder
}
