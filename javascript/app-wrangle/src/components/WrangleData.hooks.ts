/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile } from '@datashaper/schema/dist/Profile.js'
import type { TableContainer } from '@datashaper/tables'
import { renameDuplicatedFileName } from '@datashaper/utilities'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const TABLE_ARG = 'table'
const RESOURCE_ARG = 'resource'

export function useSelectedTable(): string | undefined {
	return useQueryArg(TABLE_ARG)
}

export function useSelectedResource(): Profile | undefined {
	return useQueryArg(RESOURCE_ARG) as Profile | undefined
}

function useQueryArg(name: string): string | undefined {
	const location = useLocation()
	const search = useMemo(
		() => new URLSearchParams(location.search),
		[location.search],
	)
	return useMemo(() => {
		if (search.has(name)) {
			return search.get(name) ?? undefined
		}
	}, [search, name])
}

export function useTables(setSelectedTableId: (id: string) => void): {
	tables: TableContainer[]
	onAddTables: (update: TableContainer[]) => void
} {
	const [tables, setTables] = useState<TableContainer[]>([])

	const onAddTables = useCallback(
		(update: TableContainer[]) => {
			if (update.length > 0) {
				const map = new Map<string, number>()
				const allTables = [...tables, ...update]
				const renamedTables = allTables.map(t => ({
					...t,
					id: renameDuplicatedFileName(map, t.id),
				}))
				setSelectedTableId(renamedTables[renamedTables.length - 1]?.id)
				setTables(renamedTables)
			}
		},
		[setTables, setSelectedTableId, tables],
	)

	return {
		tables,
		onAddTables,
	}
}
