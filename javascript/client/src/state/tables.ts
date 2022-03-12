/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import type { DataTable } from '~types'

const NO_TABLES: DataTable[] = []

const originalTablesState = atom<DataTable[]>({
	key: 'original-tables-store',
	default: [],
	dangerouslyAllowMutability: true,
})

export function useSetOriginalTables(): SetterOrUpdater<DataTable[]> {
	return useSetRecoilState(originalTablesState)
}

export function useOriginalTables(): DataTable[] {
	return useRecoilValue(originalTablesState)
}

export function useSetOrUpdateOriginalTable(): (table: DataTable) => void {
	const setOriginalTable = useSetRecoilState(originalTablesState)
	return useCallback(
		(table: DataTable) => {
			setOriginalTable(prev => {
				return [
					...(prev?.filter(i => i.tableId !== table.tableId) ?? []),
					table,
				]
			})
		},
		[setOriginalTable],
	)
}

export function useSelectOriginalTable(id: string): () => DataTable {
	const tables = useRecoilValue(originalTablesState) ?? NO_TABLES

	return useCallback(() => {
		return tables.find(t => t.tableId === id)!
	}, [tables, id])
}

export function useResetOriginalTables(): Resetter {
	return useResetRecoilState(originalTablesState)
}
