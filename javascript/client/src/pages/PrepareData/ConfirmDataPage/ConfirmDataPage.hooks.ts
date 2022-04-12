/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, ElementDefinition, Maybe } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import { useAllVariables } from '~hooks'
import { useCausalFactors, useExperiment, useOutputTablePrep } from '~state'

export function useBusinessLogic(): { output: Maybe<ColumnTable> } {
	const outputTablePrep = useOutputTablePrep()
	const causalFactors = useCausalFactors()
	const defineQuestion = useExperiment()
	const allVariables = useAllVariables(causalFactors, defineQuestion)

	const columns = useMemo((): string[] => {
		const columnNames = outputTablePrep?.columnNames()
		const selectedColumns = allVariables.map(
			(v: CausalFactor | ElementDefinition) => v.column,
		)
		return selectedColumns.filter(
			(col: string | undefined) => col && columnNames?.includes(col),
		) as string[]
	}, [allVariables, outputTablePrep])

	const output = useMemo(() => {
		return outputTablePrep?.select(columns)
	}, [columns, outputTablePrep])

	return {
		output,
	}
}
