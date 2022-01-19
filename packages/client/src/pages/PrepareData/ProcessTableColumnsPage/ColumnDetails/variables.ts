/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RowObject } from 'arquero/dist/types/table/table'
import { useMemo } from 'react'
import { HistogramData, MissingArgs } from './interfaces'
import { ColumnRelation, ColumnRelevance } from '~enums'
import { TableColumn } from '~interfaces'

export function useRelation(
	columnName: string,
	tableColumns?: TableColumn[],
): ColumnRelation[] {
	return useMemo(
		() => tableColumns?.find(x => x.name === columnName)?.relation || [],
		[tableColumns, columnName],
	)
}

export function useInvalidValues(
	columnName: string,
	tableColumns?: TableColumn[],
): string[] {
	return useMemo(
		() => tableColumns?.find(a => a.name === columnName)?.invalidValues || [],
		[tableColumns, columnName],
	)
}

export function useIsSubjectIdentifierAvailable(
	tableColumns?: TableColumn[],
): boolean {
	return useMemo(
		() =>
			!tableColumns?.filter(
				x => x.relevance === ColumnRelevance.SubjectIdentifier,
			)?.length,
		[tableColumns],
	)
}

export function useHistogramData(
	columnName: string,
	values?: RowObject[],
): HistogramData[] {
	return useMemo(() => {
		const count =
			values?.reduce(function (obj, name) {
				obj[name[columnName]] = obj[name[columnName]]
					? ++obj[name[columnName]]
					: 1
				return obj
			}, {}) || {}

		const objectKeys = Object.keys(count)
		const valuesCount = objectKeys.map(val => {
			return {
				name: val,
				count: count[val],
			}
		})

		return valuesCount
	}, [values, columnName])
}

export function useMissing({
	values,
	columnName,
	invalidValues,
	toggleInvalidValue,
	tableColumns,
}: MissingArgs): { percentage: string; missing: number } {
	return useMemo(() => {
		if (!tableColumns?.find(a => a.name === columnName)) {
			toggleInvalidValue(null)
		}
		const total = values?.length || 0
		const missing =
			values?.filter(
				x =>
					(invalidValues.includes('null') && x[columnName] === null) ||
					invalidValues.includes(x[columnName]?.toString()),
			).length || 0

		const percentage = ((100 * missing) / total).toFixed(2)
		return { percentage, missing }
	}, [values, columnName, invalidValues, toggleInvalidValue, tableColumns])
}
