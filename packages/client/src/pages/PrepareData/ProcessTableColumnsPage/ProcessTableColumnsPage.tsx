/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { ColumnRelevanceSelector } from './ColumnRelevanceSelector'
import { useBusinessLogic } from './hooks'
import { DatasetsList } from '~components/DatasetsList'
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
			relation,
			isSubjectIdentifierAvailable,
			onRelevanceChange,
			relevance,
			onDefinitionChange,
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
								table={selectedTable.columns}
								name={selectedFile?.alias ?? selectedFile?.name}
								commands={tableCommands}
								showRowCount
								showColumnCount
							/>
							<DetailsListContainer>
								<ArqueroDetailsList
									table={selectedTable.columns}
									onColumnClick={onSelectColumn}
									selectedColumn={selectedColumn}
									visibleColumns={columns.map(x => x.name)}
									isColumnClickable
									isSortable
									isHeadersFixed
									isStriped
									showColumnBorders
									features={{ smartHeaders: true }}
								/>
							</DetailsListContainer>
						</TableContainer>

						{selectedColumn && (
							<RelevanceContainer>
								<SectionTitle>Relevance</SectionTitle>
								<ColumnRelevanceSelector
									isSubjectIdentifierAvailable={isSubjectIdentifierAvailable}
									relevance={relevance}
									relation={relation}
									onRelevanceChange={onRelevanceChange}
									onDefinitionChange={onDefinitionChange}
									selectedColumn={selectedColumn}
								/>
							</RelevanceContainer>
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

const TableContainer = styled.div``

const DetailsListContainer = styled.div`
	overflow-y: scroll;
	overflow-x: scroll;
	height: 50vh;
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

const RelevanceContainer = styled.div`
	width: 100%;
`

const SectionTitle = styled.h2``
