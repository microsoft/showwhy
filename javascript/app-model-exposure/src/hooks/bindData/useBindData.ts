/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDataTables } from '@showwhy/app-common'
import type { TableContainer } from '@datashaper/tables'
import type { DataTable, Maybe } from '@datashaper/workflow'
import { useMemo } from 'react'

import {
	useSelectedTableName,
	useSetSelectedTableName,
} from '../../state/selectedDataPackage.js'
import type { Handler1 } from '../../types/primitives.js'

export function useBindData(): {
	selectedTableName: Maybe<string>
	selectedTable: Maybe<TableContainer>
	onSelectTableId: Handler1<Maybe<string>>
	tables: DataTable[]
} {
	const tables = useDataTables()
	const selectedTableName = useSelectedTableName()
	const setSelectedTable = useSetSelectedTableName()
	const selectedTable = useMemo(
		(): Maybe<TableContainer> =>
			tables.find(x => x.id === selectedTableName)?.currentOutput,
		[selectedTableName, tables],
	)

	return {
		selectedTableName,
		selectedTable,
		tables,
		onSelectTableId: setSelectedTable,
	}
}
