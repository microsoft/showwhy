/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useAllVariables, useIsMicrodata } from '~hooks'
import {
	useCausalFactors,
	useExperiment,
	useOutputTablePrep,
	useSubjectIdentifier,
} from '~state'

export function useDataErrors(): {
	isMicrodata: boolean
	isMissingVariable: boolean
	hasIdentifier: boolean
	hasAnyError: boolean
} {
	const outputTable = useOutputTablePrep()
	const subjectIndentifier = useSubjectIdentifier()
	const isMicrodata = useIsMicrodata(outputTable, subjectIndentifier)

	const definitions = useExperiment()
	const causalFactors = useCausalFactors()
	const allVariables = useAllVariables(causalFactors, definitions)

	const hasAnyError = useMemo((): any => {
		return (
			isMicrodata || allVariables.some(v => !v.column) || !!subjectIndentifier
		)
	}, [isMicrodata, allVariables, subjectIndentifier])

	return {
		isMicrodata,
		isMissingVariable: allVariables.some(v => !v.column),
		hasIdentifier: !!subjectIndentifier,
		hasAnyError,
	}
}
