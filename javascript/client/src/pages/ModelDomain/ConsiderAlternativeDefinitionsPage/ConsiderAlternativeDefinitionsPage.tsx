/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ElementDefinition } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { TableComponent } from '~components/Tables/TableComponent'
import { Container } from '~styles'
// import type { HeaderData } from '~types'

import { useBusinessLogic } from './hooks'

const tableHeadersList: HeaderData[] = [
	{ fieldName: 'level', value: 'Level' },
	{ fieldName: 'type', value: 'Type' },
	{ fieldName: 'variable', value: 'Definition' },
	{ fieldName: 'description', value: 'Description' },
]

export const ConsiderAlternativeDefinitionsPage: React.FC = memo(
	function ConsiderAlternativeDefinitionsPage() {
		const {
			labelInterest,
			definitionToEdit,
			descriptionInterest,
			itemList,
			pageType,
			defineQuestion,
			addDefinition,
			editDefinition,
			removeDefinition,
			setDefinitionToEdit,
			handleDefinitionTypeChange,
		} = useBusinessLogic()

		return (
			<Container>
				{/* <Container>
					<Div>
						<FieldTitle data-pw="title">{pageType}: &nbsp;</FieldTitle>
						<DetailsText>{labelInterest}</DetailsText>
					</Div>
					<DetailsText>{descriptionInterest}</DetailsText>
				</Container> */}

				<FormContainer>
					{/* <DefinitionTitle>Alternative {pageType} definitions</DefinitionTitle> */}
					<DefinitionTitle>Alternative definitions</DefinitionTitle>
					<TableContainer>
						<TableComponent
							headers={tableHeadersList}
							columns={itemList}
							definitionToEdit={definitionToEdit}
							onDelete={removeDefinition}
							onEdit={setDefinitionToEdit}
							onCancel={() => setDefinitionToEdit(undefined)}
							onSave={editDefinition}
							pageType={pageType}
						/>
						<FactorsDefinitionForm
							onAdd={definition =>
								addDefinition(definition as ElementDefinition)
							}
							defineQuestion={defineQuestion}
							pageType={pageType}
							showType={true}
							onDefinitionTypeChange={handleDefinitionTypeChange}
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
