/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import { Maybe, VariableDefinition } from '~types'

export function useViewTable(
	selectedDefinitionId: string,
	variables: VariableDefinition[],
	outputTable?: ColumnTable,
	subjectIdentifier?: string,
): Maybe<ColumnTable> {
	return useMemo((): Maybe<ColumnTable> => {
		const steps =
			variables
				.find(a => a.id === selectedDefinitionId)
				?.steps.flatMap(s => {
					const a = s.args as Record<string, any>
					return a.to
				}) || []
		const columns = [subjectIdentifier, ...steps]
		//what if the user didnt chose one
		return subjectIdentifier ? outputTable?.select(columns) : undefined
	}, [variables, subjectIdentifier, selectedDefinitionId, outputTable])
}
