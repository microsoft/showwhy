/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IComboBoxOption } from '@fluentui/react'
import { useMemo } from 'react'
import { ColumnRelevance } from '~enums'
import {
	useProjectFiles,
	useSelectOriginalTable,
	useTableColumns,
} from '~state'

export function useVariableOptions(): IComboBoxOption[] | undefined {
	const projectFiles = useProjectFiles()
	const originalTableState = useSelectOriginalTable(
		projectFiles ? (projectFiles[0]?.id as string) : '',
	)
	const originalTable = originalTableState()?.columns
	const columns = useTableColumns(
		projectFiles ? projectFiles[0]?.id : undefined,
	)

	return useMemo(() => {
		const removedColumns =
			columns
				?.filter(col => col.relevance === ColumnRelevance.NotCausallyRelevant)
				.map(x => x.name) || []
		const filteredColumns =
			originalTable?.columnNames().filter(x => !removedColumns?.includes(x)) ||
			[]
		const validColumns = filteredColumns.map(x => {
			return { key: x, text: x }
		})
		return validColumns || []
	}, [columns, originalTable])
}
