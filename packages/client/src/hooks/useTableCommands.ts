/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { visibleColumnsCommand } from '@data-wrangling-components/react'
import { IColumn, ICommandBarItemProps } from '@fluentui/react'
import { useCallback, useMemo } from 'react'
import { DataTable } from '~interfaces'

export function useTableCommands(
	table: DataTable | undefined,
	visibleColumns: IColumn[] | undefined,
	restoreColumn: (column: string) => void,
	removeColumn: (column: string) => void,
): ICommandBarItemProps[] {
	const handleColumnCheckChange = useCallback(
		(column: string, checked: boolean) => {
			if (checked) {
				restoreColumn(column)
			} else {
				removeColumn(column)
			}
		},
		[restoreColumn, removeColumn],
	)

	const vccmd = useMemo(() => {
		if (!table) return undefined
		return visibleColumnsCommand(
			table?.table,
			visibleColumns?.map(x => x.name),
			handleColumnCheckChange,
		)
	}, [table, visibleColumns, handleColumnCheckChange])

	return useMemo(() => {
		return vccmd ? [vccmd] : []
	}, [vccmd])
}
