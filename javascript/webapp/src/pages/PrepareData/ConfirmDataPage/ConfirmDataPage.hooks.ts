/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Definition, Maybe } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import { useAllVariables } from '~hooks'
import { useCausalFactors, useDefinitions, useOutputTablePrep } from '~state'

export function useOutput(): { output: Maybe<ColumnTable> } {
	const outputTablePrep = useOutputTablePrep()
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	const allVariables = useAllVariables(causalFactors, definitions)

	const columns = useMemo((): string[] => {
		const columnNames = outputTablePrep?.columnNames()
		const selectedColumns = allVariables.map(
			(v: CausalFactor | Definition) => v.column,
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
