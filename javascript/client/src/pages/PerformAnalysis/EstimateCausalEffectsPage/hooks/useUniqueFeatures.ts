/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification } from '@showwhy/types'
import { useMemo } from 'react'

import { useSpecificationFeatureColumns } from '../EstimateCausalEffectPage.hooks'

/**
 * Returns a list of the unique feature values for the standard columns.
 * In other words, this is a list of rows for the dot plot.
 * @param data
 */
export function useUniqueFeatures(data: Specification[]): string[] {
	const columns = useSpecificationFeatureColumns()
	return useMemo(() => {
		const unique = new Set<{
			column: string
			value: string
			sort: string
		}>()
		data.forEach(row => {
			columns.forEach(col => {
				const val = (row as any)[col]
				unique.add({
					column: col,
					value: `${val}`,
					sort: `${col} - ${val}`,
				})
			})
		})
		const sorted = Array.from(unique.values()).sort((a, b) =>
			a.sort.localeCompare(b.sort),
		)
		return Array.from(new Set(sorted.map(item => item.value)))
	}, [data, columns])
}
