/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Definition, Maybe } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import { useAllVariables, useOutputLast } from '~hooks'
import { useCausalFactors, useDefinitions } from '~state'

export function useOutput(): { output: Maybe<ColumnTable> } {
	const outputTable = useOutputLast()
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	const allVariables = useAllVariables(causalFactors, definitions)

	const columns = useMemo((): string[] => {
		const columnNames = outputTable?.columnNames()
		const selectedColumns = allVariables.map(
			(v: CausalFactor | Definition) => v.column,
		)
		return selectedColumns.filter(
			(col: string | undefined) => col && columnNames?.includes(col),
		) as string[]
	}, [allVariables, outputTable])

	const output = useMemo(() => {
		return outputTable?.select(columns)
	}, [columns, outputTable])

	return {
		output,
	}
}
