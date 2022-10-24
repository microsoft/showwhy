/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { useEffect, useState } from 'react'

import { useDataPackage } from './useDataPackage.js'

export function useDataTable(name: string): DataTable | undefined {
	const dp = useDataPackage()
	const tableStore = dp.tableStore
	const [table, setTable] = useState<DataTable | undefined>(() =>
		tableStore.get(name),
	)
	useEffect(() => {
		const sub = tableStore.tables$.subscribe(tables => {
			setTable(tables.find(t => t.name === name))
		})
		return () => sub.unsubscribe()
	}, [tableStore, name])
	return table
}
