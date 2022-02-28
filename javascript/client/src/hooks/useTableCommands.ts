/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { visibleColumnsCommand } from '@data-wrangling-components/react'
import type { IColumn, ICommandBarItemProps } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import type { DataTable } from '~types'

export function useTableCommands(
	table: Maybe<DataTable>,
	visibleColumns: Maybe<IColumn[]>,
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
