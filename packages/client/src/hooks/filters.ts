/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import { FilterType, FilterObject, TableDerivationType } from '~interfaces'

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

			switch (filterObject.filter) {
				case '==':
					return (
						d[column]?.toString().toLowerCase() ===
						value?.toString().toLowerCase()
					)
				case '!=':
					return (
						d[column].toString().toLowerCase() !==
						value.toString().toLowerCase()
					)
				case '>':
					return +d[column] > +value
				case '>=':
					return +d[column] >= +value
				case '<':
					return +d[column] < +value
				case '<=':
					return +d[column] <= +value
				case 'containing':
					return value
						.toLowerCase()
						.replace(' ', '')
						.split(',')
						.includes(d[column].toString().toLowerCase())
				case 'not containing':
					return !value
						.toLowerCase()
						.replace(' ', '')
						.split(',')
						.includes(d[column].toString().toLowerCase())
				case 'not in range':
					if (actualFilterValue?.inclusive) {
						return +d[column] >= upper && +d[column] <= lower
					}
					return +d[column] > upper && +d[column] < lower
				case 'in range':
					if (actualFilterValue?.inclusive) {
						return +d[column] <= upper && +d[column] >= lower
					}
					return +d[column] < upper && +d[column] > lower
			}
			return false
		},
		[],
	)
}
