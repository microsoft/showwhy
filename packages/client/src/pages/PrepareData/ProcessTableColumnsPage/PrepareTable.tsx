/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { RowObject } from 'arquero/dist/types/table/table'
import React, { memo, useCallback, useMemo } from 'react'

import styled from 'styled-components'
import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import { HeaderData, Item, TableColumn } from '~interfaces'

interface PrepareTableProps {
	headers: string[] | undefined
	selectedColumn: string
	onSelectColumn: (column: string) => void
	data: RowObject[]
	tableColumns: TableColumn[] | undefined
}

export const PrepareTable: React.FC<PrepareTableProps> = memo(
	function PrepareTable({
		headers,
		selectedColumn,
		onSelectColumn,
		data,
		tableColumns,
	}) {
		const columnIsDone = useCallback(
			(column: string) => tableColumns?.find(x => x.name === column)?.isDone,
			[tableColumns],
		)

		const itemList: Item[] = useItems(data, headers)

		const headersList: HeaderData[] = useHeaders(headers, columnIsDone)

		return (
			<Container>
				<GenericTableComponent
					props={{ styles: { height: '350px' } }}
					items={itemList}
					headers={{ data: headersList }}
					onColumnClick={onSelectColumn}
					selectedColumn={selectedColumn}
				/>
			</Container>
		)
	},
)

function useItems(data, headers) {
	return useMemo(() => {
		return data.map((row, i) => {
			const obj = {}
			headers?.forEach(column => {
				obj[column] = row[column]
			})
			return obj
		})
	}, [headers, data])
}

function useHeaders(headers, columnIsDone) {
	return useMemo(() => {
		return (
			headers?.map(column => ({
				fieldName: column,
				value: (
					<Div>
						{column}
						<ColumnIcon
							title={columnIsDone(column) ? 'Column ready' : 'Column not ready'}
							iconName={columnIsDone(column) ? 'Accept' : 'Help'}
						/>
					</Div>
				),
			})) || []
		)
	}, [headers, columnIsDone])
}

const Container = styled.section``

const Div = styled.div`
	display: flex;
	align-items: center;
	white-space: nowrap;
`

const ColumnIcon = styled(Icon)`
	margin-left: 8px;
	color: ${({ theme }) => theme.application().accent};

	&[data-icon-name='Help'] {
		color: ${({ theme }) => theme.application().border};
	}
`
