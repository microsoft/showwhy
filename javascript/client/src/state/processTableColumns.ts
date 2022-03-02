/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import { useCallback } from 'react'
import {
	atom,
	atomFamily,
	DefaultValue,
	Resetter,
	selectorFamily,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import type { ProjectFile, TableColumn } from '~types'

export const tableColumnsState = atomFamily<
	Maybe<TableColumn[]>,
	Maybe<string>
>({
	key: 'table-columns',
	default: [],
})

const keys = atom<string[]>({
	key: 'tables-keys',
	default: [],
})

export const useSetTableColumnSelector = selectorFamily({
	key: 'table-columns-access',
	get:
		(key: Maybe<string>) =>
		({ get }) =>
			get(tableColumnsState(key)),
	set:
		(key: Maybe<string>) =>
		({ set }, newValue: Maybe<TableColumn[] | DefaultValue>) => {
			set<Maybe<TableColumn[]>>(tableColumnsState(key), newValue)
			set(keys, prev => {
				if (key && !prev.includes(key)) {
					return [...prev, key]
				}
				return prev
			})
		},
})

export function useSetTableColumns(
	key: Maybe<string>,
): SetterOrUpdater<Maybe<TableColumn[]>> {
	return useSetRecoilState(useSetTableColumnSelector(key))
}

export function useTableColumns(key: Maybe<string>): Maybe<TableColumn[]> {
	return useRecoilValue(useSetTableColumnSelector(key))
}

export interface RecoilTableColumn {
	id: string
	name: string
}

export const allTableColumnsState = selectorFamily({
	key: 'all-table-columns',
	get:
		(ids: { id: string; name: string }[]) =>
		({ get }) => {
			return ids.map(file => {
				const table = get(tableColumnsState(file.id))
				return table?.map(t => {
					return {
						...t,
						tableId: file.id,
						tableName: file.name,
					}
				})
			})
		},
})

export function useAllTableColumns(
	files: ProjectFile[],
): Partial<TableColumn[][]> {
	const obj = files.map(x => {
		return { id: x.id || '', name: x.alias || x.name }
	}) as RecoilTableColumn[]
	const byId = useRecoilValue(allTableColumnsState(obj))
	return byId
}

export function useResetTableColumns(): Resetter {
	const reset = useResetRecoilState
	const setTableState = useSetRecoilState(keys)
	const ids = useRecoilValue(keys)
	return useCallback(() => {
		ids.forEach(id => reset(tableColumnsState(id)))
		setTableState([])
	}, [ids, reset, setTableState])
}
