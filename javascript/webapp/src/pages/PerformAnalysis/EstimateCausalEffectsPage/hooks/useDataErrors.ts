/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useAllVariables, useIsDataTypeValid, useOutputTable } from '~hooks'
import { useDefinitions, useSubjectIdentifier } from '~state'
import { isFullDatasetPopulation } from '~utils'

import { useIsMicrodata } from './useIsMicrodata'

export function useDataErrors(): {
	isMicrodata: boolean
	isMissingVariable: boolean
	isMissingIdentifier: boolean
	isNotInOutputTable: boolean
	isValidDataType: boolean
	hasAnyError: boolean
} {
	const outputTable = useOutputTable()
	const subjectIdentifier = useSubjectIdentifier()
	const definitions = useDefinitions()
	const allVariables = useAllVariables()
	const isMicrodata = useIsMicrodata(outputTable, subjectIdentifier)
	const [isValidDataType = true] = useIsDataTypeValid() || []
	const variablesColumns = useMemo(
		() => [subjectIdentifier, ...allVariables.map(v => v.column)],
		[subjectIdentifier, allVariables],
	)
	const outputTableColumns = useMemo(
		() => outputTable?.columnNames() || [],
		[outputTable],
	)
	const isMissingVariable = useMemo(
		() => allVariables.some(i => !i.column),
		[allVariables],
	)
	const isNotInOutputTable = useMemo(
		() =>
			variablesColumns
				.filter(v => !!v)
				.some(i => {
					const missing = !outputTableColumns.includes(i || '')
					if (
						missing &&
						!!definitions.find(
							x => x.column === i && isFullDatasetPopulation(x),
						)
					) {
						return false
					}
					return missing
				}),
		[variablesColumns, outputTableColumns, definitions],
	)
	const isMissingIdentifier = !subjectIdentifier && !!outputTable

	const hasAnyError = useMemo((): any => {
		return (
			!isMicrodata ||
			isMissingVariable ||
			isMissingIdentifier ||
			isNotInOutputTable ||
			!isValidDataType
		)
	}, [
		isMicrodata,
		isMissingVariable,
		isMissingIdentifier,
		isNotInOutputTable,
		isValidDataType,
	])
	return {
		isMicrodata,
		isMissingVariable,
		isMissingIdentifier,
		isNotInOutputTable,
		isValidDataType,
		hasAnyError,
	}
}
