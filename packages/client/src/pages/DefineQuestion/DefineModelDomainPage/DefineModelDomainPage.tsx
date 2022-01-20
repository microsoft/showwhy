/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './hooks'
import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { TableComponent } from '~components/Tables/TableComponent'
import { ElementDefinition, HeaderData } from '~interfaces'
import { Container } from '~styles'

const tableHeadersList: HeaderData[] = [
	{ fieldName: 'level', value: 'Level' },
	{ fieldName: 'variable', value: 'Definition' },
	{ fieldName: 'description', value: 'Description' },
]

export const DefineModelDomainPage: React.FC = memo(
	function DefineModelDomainPage() {
		const {
			labelInterest,
			definitionToEdit,
			descriptionInterest,
			itemList,
			pageType,
			variables,
			defineQuestion,
			addDefinition,
			editDefinition,
			removeDefinition,
			setDefinitionToEdit,
		} = useBusinessLogic()

		return (
			<Container>
				<Container>
					<Div>
						<FieldTitle>{pageType}: &nbsp;</FieldTitle>
						<DetailsText>{labelInterest}</DetailsText>
					</Div>
					<DetailsText>{descriptionInterest}</DetailsText>
				</Container>

				<FormContainer>
					<DefinitionTitle>Alternative {pageType} definitions</DefinitionTitle>
					<TableContainer>
						<TableComponent
							headers={tableHeadersList}
							columns={itemList as any[]}
							definitionToEdit={definitionToEdit}
							onDelete={removeDefinition}
							onEdit={setDefinitionToEdit}
							onCancel={() => setDefinitionToEdit(undefined)}
							onSave={editDefinition}
							pageType={pageType}
							variables={variables}
						/>
						<FactorsDefinitionForm
							onAdd={definition =>
								addDefinition(definition as ElementDefinition)
							}
							defineQuestion={defineQuestion}
							pageType={pageType}
							variables={variables}
						/>
					</TableContainer>
				</FormContainer>
			</Container>
		)
	},
)

const TableContainer = styled.div`
	margin-bottom: 24px;
`

const DetailsText = styled.span`
	display: flex;
	flex-direction: column;
	margin-top: 1.1rem;
`

const Div = styled.div`
	display: flex;
	align-items: center;
`

const FieldTitle = styled.h4`
	margin-bottom: unset;
	text-transform: capitalize;
`

const DefinitionTitle = styled.h4``

const FormContainer = styled.div`
	margin-top: 16px;
`
