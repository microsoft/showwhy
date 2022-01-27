/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader } from '@data-wrangling-components/react'
import { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './hooks'
import { DatasetsList } from '~components/DatasetsList'
import { ArqueroDetailsTable } from '~components/Tables/ArqueroDetailsTable'
import { Container } from '~styles'

export const ProcessTableColumnsPage: React.FC = memo(
	function ProcessTableColumnsPage() {
		const {
			files,
			selectedFile,
			selectedTable,
			onChangeFile,
			columns,
			tableCommands,
			selectedColumn,
			onSelectColumn,
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

				{selectedTable && (
					<TableDetailsContainer>
						<TableContainer>
							<ArqueroTableHeader
								table={selectedTable.table}
								name={selectedFile?.alias ?? selectedFile?.name}
								commands={tableCommands}
								visibleColumns={columns.map(col => col.name)}
								showRowCount
								showColumnCount
							/>
							<DetailsListContainer>
								<ArqueroDetailsTable
									table={selectedTable.table}
									onColumnClick={onSelectColumn}
									selectedColumn={selectedColumn}
									visibleColumns={columns.map(col => col.name)}
									columns={columns}
									isColumnClickable
									features={{ smartHeaders: true }}
								/>
							</DetailsListContainer>
						</TableContainer>
					</TableDetailsContainer>
				)}
			</Container>
		)
	},
)

const TableDetailsContainer = styled.div`
	margin-top: 24px;
`

const TableContainer = styled.div``

const DetailsListContainer = styled.div`
	height: 70vh;
`

const TitleTableEmptyContainer = styled.div`
	color: ${({ theme }) => theme.application().midContrast().hex()};
	margin-left: 16px;
	display: flex;
`

const TitleTableEmptyText = styled.span`
	vertical-align: bottom;
	margin: auto;
`
