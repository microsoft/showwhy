/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Comparator } from '@showwhy/types'

export function sortByField<T>(key: string, asc = true): Comparator<T> {
	return (a: T, b: T): number => {
		const aKey = (a as any)[key]
		const bKey = (b as any)[key]
		const aValue = isNaN(aKey) ? aKey : +aKey
		const bValue = isNaN(bKey) ? bKey : +bKey
		if (aValue > bValue) return 1 * (asc ? 1 : -1)
		else if (aValue < bValue) return -1 * (asc ? 1 : -1)
		else return 0
	}
}
