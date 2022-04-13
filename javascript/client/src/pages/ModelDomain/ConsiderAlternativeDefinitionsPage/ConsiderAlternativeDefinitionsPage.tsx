/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot as FUIPivot, PivotItem } from '@fluentui/react'
import type { HeaderData } from '@showwhy/components'
import type { ElementDefinition } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { Container, Title } from '~styles'

import { useBusinessLogic } from './ConsiderAlternativeDefinitionsPage.hooks'

const tableHeadersList: HeaderData[] = [
	{ fieldName: 'level', value: 'Level' },
	{ fieldName: 'variable', value: 'Label' },
	{ fieldName: 'description', value: 'Description' },
]

export const ConsiderAlternativeDefinitionsPage: React.FC = memo(
	function ConsiderAlternativeDefinitionsPage() {
		const {
			definitionToEdit,
			defineQuestion,
			pivotData,
			definitionType,
			addDefinition,
			editDefinition,
			removeDefinition,
			setDefinitionToEdit,
			handleOnLinkClick,
		} = useBusinessLogic()

		return (
			<Container>
				<Title data-pw="title">Alternative definitions</Title>
				<Pivot
					onLinkClick={handleOnLinkClick}
					aria-label="Alternative Definitions Interest labels and description"
				>
					{pivotData.map(item => (
						<PivotItem key={item.key} headerText={item.title}>
							<DetailsText>{item.label}</DetailsText>
							<DetailsText>{item.description}</DetailsText>

							<FormContainer>
								<TableContainer>
									{/* <TableComponent
										headers={tableHeadersList}
										columns={item.items}
										definitionToEdit={definitionToEdit}
										onDelete={removeDefinition}
										onEdit={setDefinitionToEdit}
										onCancel={() => setDefinitionToEdit(undefined)}
										onSave={editDefinition}
										definitionType={definitionType}
									/> */}
									{/* <Container>
			<GenericTable
				items={items}
				header={{
					data: headersData,
				}}
				props={{ 						customColumnsWidth: [
							{ fieldName: 'variable', width: '35%' },
							{ fieldName: 'description', width: '40%' },
							{ fieldName: 'actions', width: '10%' },
							{ fieldName: 'level', width: '15%' }
						] }}
			/>
		</Container> */}
									<FactorsDefinitionForm
										onAdd={definition =>
											addDefinition(definition as ElementDefinition)
										}
										defineQuestion={defineQuestion}
										definitionType={definitionType}
									/>
								</TableContainer>
							</FormContainer>
						</PivotItem>
					))}
				</Pivot>
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

const FormContainer = styled.div`
	margin-top: 16px;
`
