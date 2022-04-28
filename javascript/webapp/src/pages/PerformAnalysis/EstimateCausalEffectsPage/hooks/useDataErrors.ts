/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useAllVariables } from '~hooks'
import {
	useCausalFactors,
	useDefinitions,
	useOutputTablePrep,
	useSubjectIdentifier,
} from '~state'

import { useIsMicrodata } from './useIsMicrodata'

export function useDataErrors(): {
	isMicrodata: boolean
	isMissingVariable: boolean
	isMissingIdentifier: boolean
	isNotInOutputTable: boolean
	hasAnyError: boolean
} {
	const outputTable = useOutputTablePrep()
	const subjectIdentifier = useSubjectIdentifier()
	const definitions = useDefinitions()
	const causalFactors = useCausalFactors()
	const allVariables = useAllVariables(causalFactors, definitions)
	const isMicrodata = useIsMicrodata(outputTable, subjectIdentifier)
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
			isNotInOutputTable
		)
	}, [isMicrodata, isMissingVariable, isMissingIdentifier, isNotInOutputTable])
	return {
		isMicrodata,
		isMissingVariable,
		isMissingIdentifier,
		isNotInOutputTable,
		hasAnyError,
	}
}
