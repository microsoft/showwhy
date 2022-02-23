/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import type { DataTable } from '~types'

interface PrimaryTable {
	name: string
	id?: string
}

const originalTablesState = atom<DataTable[]>({
	key: 'original-tables-store',
	default: [],
	dangerouslyAllowMutability: true,
})

const primaryTableState = atom<PrimaryTable>({
	key: 'primary-table-store',
	default: {
		name: '',
		id: '',
	},
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
				return [...prev?.filter(i => i.tableId !== table.tableId), table]
			})
		},
		[setOriginalTable],
	)
}

export function useSelectOriginalTable(id: string): () => DataTable {
	const tables = useRecoilValue(originalTablesState)

	return useCallback(() => {
		return tables?.find(t => t.tableId === id) as DataTable
	}, [tables, id])
}

export function useResetOriginalTables(): Resetter {
	return useResetRecoilState(originalTablesState)
}

export function useSetPrimaryTable(): SetterOrUpdater<PrimaryTable> {
	return useSetRecoilState(primaryTableState)
}

export function usePrimaryTable(): PrimaryTable {
	return useRecoilValue(primaryTableState)
}

export function useResetPrimaryTable(): Resetter {
	return useResetRecoilState(primaryTableState)
}
