/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo } from 'react'

import { RawTable } from './RawTable.js'
import { RawTableDefaultFeatures } from './RawTable.types.js'
import { Container } from './TablePreview.styles.js'
import { getRawTableStyles } from './TablePreview.utils.js'

export const TablePreview: React.FC<{
	table?: ColumnTable
	error?: string
	showType?: boolean
}> = memo(function TablePreview({ table, error, showType }) {
	const theme = useTheme()
	return (
		<Container>
			{table && (
				<RawTable
					label="Preview"
					features={{
						...RawTableDefaultFeatures,
						statsColumnHeaders: showType,
					}}
					error={error}
					limit={3}
					table={table}
					styles={getRawTableStyles(theme)}
				></RawTable>
			)}
		</Container>
	)
})
