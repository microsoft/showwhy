/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { ColumnDetails } from './ColumnDetails'
import { PrepareTable } from './PrepareTable'
import { useBusinessLogic } from './hooks'
import { DatasetsList } from '~components/DatasetsList'
import { TableDataNumberDisplay } from '~components/Tables/TableDataNumberDisplay'
import { Container } from '~styles'

export const ProcessTableColumnsPage: React.FC = memo(
	function ProcessTableColumnsPage() {
		const {
			data,
			files,
			headers,
			tableColumns,
			selectedFile,
			selectedTable,
			restoreOptions,
			onChangeFile,
			restoreColumn,
			selectedColumn,
			setSelectedColumn,
		} = useBusinessLogic()

		return (
			<Container>
				{files.length ? (
					<DatasetsList
						title="Loaded data tables"
						files={files}
						selectedFile={selectedFile}
						onFileSelected={onChangeFile}
					/>
				) : (
					<TitleTableEmptyContainer>
						<TitleTableEmptyText>Load a dataset to start</TitleTableEmptyText>
					</TitleTableEmptyContainer>
				)}

				{headers && (
					<TableDetailsContainer>
						<TableContainer>
							<TableOptions>
								<Container>
									<TableName>
										{selectedFile?.alias || selectedFile?.name}
									</TableName>
									<TableDataNumberDisplay
										numRows={data.length}
										originalNumRows={selectedTable?.columns?.numRows() || 0}
										originalNumCols={selectedTable?.columns?.numCols()}
										numColumns={headers.length}
									/>
								</Container>
								<Container>
									<RestoreDropdown
										placeholder="Restore columns"
										disabled={!restoreOptions.length}
										onChange={(e, value) => restoreColumn(value)}
										selectedKey={null}
										options={restoreOptions}
									/>
								</Container>
							</TableOptions>
							<PrepareTable
								headers={headers}
								selectedColumn={selectedColumn as string}
								onSelectColumn={columnName => setSelectedColumn(columnName)}
								data={data}
								tableColumns={tableColumns}
							/>
						</TableContainer>

						{selectedColumn && (
							<ColumnDetails
								onRemoveColumn={() => setSelectedColumn(null)}
								fileId={selectedFile?.id || ''}
								columnName={selectedColumn}
								values={selectedTable?.columns?.objects()}
							/>
						)}
					</TableDetailsContainer>
				)}
			</Container>
		)
	},
)

const TableDetailsContainer = styled.div`
	margin-top: 24px;
`

const TableContainer = styled.div`
	padding: 8px;
`

const TableName = styled.h3`
	margin: 0px;
	align-self: center;
`

const RestoreDropdown = styled(Dropdown)`
	span {
		color: black;
	}
`

const TableOptions = styled.div`
	display: flex;
	justify-content: space-between;
	padding-bottom: 8px;
	margin-bottom: 8px;
	border-bottom: 1px solid #f2f2f2;
`

const TitleTableEmptyContainer = styled.div`
	color: ${({ theme }) => theme.application().midContrast};
	margin-left: 16px;
	display: flex;
`

const TitleTableEmptyText = styled.span`
	vertical-align: bottom;
	margin: auto;
`
