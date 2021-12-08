/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import { TableDataNumberDisplay } from '~components/Tables/TableDataNumberDisplay'
import { useDefaultTableSample } from '~hooks'

interface ModelTableProps {
	columnNames: string[]
	columnsData: ColumnTable
	sortable?: boolean
}

export const ModelTable: React.FC<ModelTableProps> = memo(function ModelTable({
	sortable = false,
	columnNames,
	columnsData,
}) {
	const tableSample = useDefaultTableSample()

	const headers = useMemo(() => {
		return columnNames.map(h => ({
			value: h,
			fieldName: h,
		}))
	}, [columnNames])

	return (
		<Container>
			<TableContainer>
				<GenericTableComponent
					headers={{ data: headers, props: { isSortable: sortable } }}
					items={columnsData.objects()}
					tableTitle={
						<TableNameContainer>
							{columnsData && (
								<TableDataNumberDisplay
									numRows={tableSample}
									originalNumRows={columnsData.numRows()}
									originalNumCols={headers.length}
								/>
							)}
						</TableNameContainer>
					}
					props={{
						styles: { textAlign: 'center' },
					}}
				/>
			</TableContainer>
		</Container>
	)
})

const TableContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const TableNameContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`
const Container = styled.div`
	max-height: 24rem;
	width: 100%;
	display: flex;
	margin-bottom: 16px;
`
