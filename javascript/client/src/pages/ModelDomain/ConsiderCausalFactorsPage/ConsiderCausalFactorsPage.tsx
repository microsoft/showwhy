/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { TableComponent } from '~components/Tables/TableComponent'
import { Container } from '~styles'
import type { HeaderData } from '~types'

import { useBusinessLogic } from './hooks'

const tableHeaders: HeaderData[] = [
	{ fieldName: 'variable', value: 'Factor', width: '15%' },
	{ fieldName: 'description', value: 'Description' },
]

export const ConsiderCausalFactorsPage: React.FC = memo(
	function ConsiderCausalFactorsPage() {
		const {
			factor,
			isEditing,
			flatFactorsList,
			addFactor,
			editFactor,
			deleteFactor,
			setFactor,
			setNewFactor,
			setIsEditing,
			goToFactorsPage,
			page,
		} = useBusinessLogic()

		return (
			<Container>
				<Container>
					<FieldTitle data-pw="title">Possible causal factors</FieldTitle>
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
					onChange={setNewFactor}
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

const FieldTitle = styled.h3`
	margin-bottom: unset;
`

const ButtonContainer = styled.div`
	text-align: center;
	margin-top: 1rem;
`
