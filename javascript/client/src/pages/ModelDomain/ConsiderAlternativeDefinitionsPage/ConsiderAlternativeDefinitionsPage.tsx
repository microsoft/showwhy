/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot as FUIPivot, PivotItem } from '@fluentui/react'
import type { ElementDefinition } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { TableComponent } from '~components/Tables/TableComponent'
import { Container } from '~styles'
import type { HeaderData } from '~types'

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
			definitionToEdit,
			itemList,
			defineQuestion,
			pivotData,
			addDefinition,
			editDefinition,
			removeDefinition,
			setDefinitionToEdit,
			setDefinition,
		} = useBusinessLogic()

		return (
			<Container>
				{pivotData.length ? (
					<Pivot aria-label="Alternative Definitions Interest labels and description">
						{pivotData.map(item => (
							<PivotItem key={item.title} headerText={item.title}>
								<DetailsText>{item.label}</DetailsText>
								<DetailsText>{item.description}</DetailsText>
							</PivotItem>
						))}
					</Pivot>
				) : null}

				<FormContainer>
					<DefinitionTitle data-pw="title">
						Alternative definitions
					</DefinitionTitle>
					<TableContainer>
						<TableComponent
							headers={tableHeadersList}
							columns={itemList}
							definitionToEdit={definitionToEdit}
							onDelete={removeDefinition}
							onEdit={setDefinitionToEdit}
							onCancel={() => setDefinitionToEdit(undefined)}
							onSave={editDefinition}
						/>
						<FactorsDefinitionForm
							onAdd={definition =>
								addDefinition(definition as ElementDefinition)
							}
							defineQuestion={defineQuestion}
							showType={true}
							onChange={setDefinition}
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
	margin-top: 0.5rem;
`

const Pivot = styled(FUIPivot)`
	margin: 0 0 1.5rem;
`

const DefinitionTitle = styled.h4``

const FormContainer = styled.div`
	margin-top: 16px;
`
