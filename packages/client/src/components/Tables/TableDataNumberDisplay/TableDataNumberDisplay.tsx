/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'

interface TableDataNumberDisplayProps {
	originalNumRows?: number
	originalNumCols?: number
	numRows?: number
	numColumns?: number
	title?: string
}

export const TableDataNumberDisplay: React.FC<TableDataNumberDisplayProps> =
	memo(function TableDataNumberDisplay({
		numRows,
		originalNumRows,
		numColumns,
		originalNumCols,
		title = 'Showing',
	}) {
		const numberOfRows = useMemo((): number | undefined => {
			if (!!originalNumRows && !!numRows) {
				return originalNumRows > numRows ? numRows : originalNumRows
			}
			return numRows
		}, [numRows, originalNumRows])

		const rows = useMemo(() => {
			return (
				<Text>
					{title}: {numberOfRows ? `${numberOfRows}/` : null}
					{originalNumRows} rows
				</Text>
			)
		}, [originalNumRows, title, numberOfRows])

		const columns = useMemo(() => {
			return (
				<Text>
					{numColumns ? `, ${numColumns}` : null}
					{originalNumCols
						? !numColumns
							? ', ' + originalNumCols
							: '/' + originalNumCols
						: null}{' '}
					{originalNumCols && 'columns'}
				</Text>
			)
		}, [numColumns, originalNumCols])
		return (
			<TableDetailsText>
				{rows}
				{columns}
			</TableDetailsText>
		)
	})

const TableDetailsText = styled.small`
	font-weight: normal;
`

const Text = styled.span``
