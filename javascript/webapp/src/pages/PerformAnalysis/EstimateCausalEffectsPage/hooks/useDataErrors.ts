/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useAllVariables, useIsDataTypeValid, useOutputTable } from '~hooks'
import { useCausalFactors, useDefinitions, useSubjectIdentifier } from '~state'
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
	const causalFactors = useCausalFactors()
	const allVariables = useAllVariables(causalFactors, definitions)
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
				.some(i => !outputTableColumns.includes(i || '')),
		[variablesColumns, outputTableColumns],
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
