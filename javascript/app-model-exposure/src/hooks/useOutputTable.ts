/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDataTables } from '@showwhy/app-common'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useState } from 'react'

import { useSelectedTableName } from '../state/selectedDataPackage.js'
import type { Maybe } from '../types/primitives.js'

export function useOutputTable(): Maybe<ColumnTable> {
	const [table, setTable] = useState<Maybe<ColumnTable>>()
	const packages = useDataTables()
	const selectedTableName = useSelectedTableName()
	useEffect(() => {
		const dt = packages.find(x => x.name === selectedTableName)
		if (dt) {
			const sub = dt.output.subscribe(tbl => setTable(tbl?.table))
			return () => sub.unsubscribe()
		}
	})
	return table
}
