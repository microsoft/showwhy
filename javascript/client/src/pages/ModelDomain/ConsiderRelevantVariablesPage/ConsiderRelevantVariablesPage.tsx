/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { TableComponent } from '~components/Tables/TableComponent'
import { Container, Title } from '~styles'
import type { HeaderData } from '~types'

import { useBusinessLogic } from './ConsiderRelevantVariablesPage.hooks'

const tableHeaders: HeaderData[] = [
	{ fieldName: 'variable', value: 'Label', width: '15%' },
	{ fieldName: 'description', value: 'Description' },
]

export const ConsiderRelevantVariablesPage: React.FC = memo(
	function ConsiderRelevantVariablesPage() {
		const {
			factor,
			isEditing,
			flatFactorsList,
			addFactor,
			editFactor,
			deleteFactor,
			setFactor,
			setIsEditing,
			goToFactorsPage,
			page,
		} = useBusinessLogic()

		return (
			<Container>
				<Container>
					<Title data-pw="title">Relevant variables</Title>
					<TableComponent
						headers={tableHeaders}
						columns={flatFactorsList}
						onDelete={deleteFactor}
						onEdit={editFactor}
						onSave={addFactor}
						factorToEdit={factor}
						onCancel={() => {
							setIsEditing(false)
							setFactor(undefined)
						}}
					/>
				</Container>
				<FactorsDefinitionForm
					factor={!isEditing ? factor : undefined}
					onAdd={addFactor}
					showLevel={false}
				/>
				{page ? (
					<ButtonContainer>
						<DefaultButton onClick={goToFactorsPage} data-pw="go-back-button">
							Go back to {page} page
						</DefaultButton>
					</ButtonContainer>
				) : null}
			</Container>
		)
	},
)

const ButtonContainer = styled.div`
	text-align: center;
	margin-top: 1rem;
`
