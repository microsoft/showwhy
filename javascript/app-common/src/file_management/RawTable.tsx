/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList } from '@datashaper/react'
import { MessageBarType } from '@fluentui/react'
import { memo } from 'react'

import {
	DatasetContainer,
	DetailsContainer,
	DetailsLabel,
	DetailsText,
	Message,
} from './RawTable.styles.js'
import type { RawTableProps } from './RawTable.types.js'
import { RawTableDefaultFeatures } from './RawTable.types.js'

export const RawTable: React.FC<RawTableProps> = memo(function RawTable({
	table,
	error,
	label,
	features = RawTableDefaultFeatures,
	...props
}) {
	return (
		<>
			{error && (
				<Message messageBarType={MessageBarType.error} isMultiline={false}>
					{error}
				</Message>
			)}

			<DatasetContainer>
				<DetailsContainer>
					<DetailsLabel>{label}</DetailsLabel>
					<DetailsText>
						{table.numCols()} columns,{' '}
						{props.limit ? `showing ${props.limit} out of ` : ''}{' '}
						{table.numRows() ?? 0} rows
					</DetailsText>
				</DetailsContainer>
				<ArqueroDetailsList
					compact
					sortable
					isHeaderFixed
					striped
					showColumnBorders
					table={table}
					features={features}
					{...props}
				/>
			</DatasetContainer>
		</>
	)
})
