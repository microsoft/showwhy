/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo } from 'react'

import { RawTable } from './RawTable.js'
import { RawTableDefaultFeatures } from './RawTable.types.js'
import { Container } from './TablePreview.styles.js'

export const TablePreview: React.FC<{
	table?: ColumnTable
	error?: string
	showType?: boolean
}> = memo(function TablePreview({ table, error, showType }) {
	return (
		<Container>
			{table && (
				<RawTable
					features={{
						...RawTableDefaultFeatures,
						statsColumnHeaders: showType,
					}}
					error={error}
					table={table}
				></RawTable>
			)}
		</Container>
	)
})
