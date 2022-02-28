/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import { TableDerivationType } from '~types'
import type { FilterType, FilterObject } from '@showwhy/types'

export const FILTER_FUNCTIONS: FilterType[] = [
	{
		key: '==',
		text: '=',
		placeholder: 'value',
	},
	{
		key: '!=',
		text: '!=',
		placeholder: 'value',
	},
	{
		key: '>',
		text: '>',
		placeholder: 'value',
	},
	{
		key: '>=',
		text: '>=',
		placeholder: 'value',
	},
	{
		key: '<',
		text: '<',
		placeholder: 'value',
	},
	{
		key: '<=',
		text: '<=',
		placeholder: 'value',
	},
	{
		key: 'containing',
		text: 'containing',
		placeholder: 'value list',
	},
	{
		key: 'not containing',
		text: 'not containing',
		placeholder: 'value list',
	},
	{
		key: 'in range',
		text: 'in range',
		placeholder: 'Value',
	},
	{
		key: 'not in range',
		text: 'not in range',
		placeholder: 'Value',
	},
	{
		key: TableDerivationType.PercentageTopRanking,
		text: 'in top percent by value',
		placeholder: 'Value',
	},
	{
		key: TableDerivationType.PercentageBottomRanking,
		text: 'in bottom percent by value',
		placeholder: 'Value',
	},
]

export function useFilterFunctions(): FilterType[] {
	return FILTER_FUNCTIONS
}

export function useMatchFilter(): (
	d: ColumnTable,
	filterObject: FilterObject,
	actualFilterValue?: FilterObject | null,
) => boolean {
	return useCallback(
		(
			d: ColumnTable,
			filterObject: FilterObject,
			actualFilterValue?: FilterObject | null,
		) => {
			const column = filterObject.column as string
			const value = filterObject.value as string
			const upper = filterObject.upper as number
			const lower = filterObject.lower as number

			const val = (d as any)[column]

			switch (filterObject.filter) {
				case '==':
					return (
						val?.toString().toLowerCase() === value?.toString().toLowerCase()
					)
				case '!=':
					return val.toString().toLowerCase() !== value.toString().toLowerCase()
				case '>':
					return +val > +value
				case '>=':
					return +val >= +value
				case '<':
					return +val < +value
				case '<=':
					return +val <= +value
				case 'containing':
					return value
						.toLowerCase()
						.replace(' ', '')
						.split(',')
						.includes(val.toString().toLowerCase())
				case 'not containing':
					return !value
						.toLowerCase()
						.replace(' ', '')
						.split(',')
						.includes(val.toString().toLowerCase())
				case 'not in range':
					if (actualFilterValue?.inclusive) {
						return +val >= upper && +val <= lower
					}
					return +val > upper && +val < lower
				case 'in range':
					if (actualFilterValue?.inclusive) {
						return +val <= upper && +val >= lower
					}
					return +val < upper && +val > lower
			}
			return false
		},
		[],
	)
}
