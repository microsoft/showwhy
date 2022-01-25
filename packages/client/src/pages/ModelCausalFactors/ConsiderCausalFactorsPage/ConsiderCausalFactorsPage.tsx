/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './hooks'
import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { TableComponent } from '~components/Tables/TableComponent'
import { HeaderData } from '~interfaces'
import { Container } from '~styles'

const tableHeaders: HeaderData[] = [
	{ fieldName: 'variable', value: 'Factor' },
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
			setIsEditing,
			goToFactorsPage,
			page,
			pageType,
			variables,
		} = useBusinessLogic()

		return (
			<Container>
				<Container>
					<FieldTitle>Possible causal factors</FieldTitle>
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
						pageType={pageType}
						variables={variables}
					/>
				</Container>
				<FactorsDefinitionForm
					factor={!isEditing ? factor : undefined}
					onAdd={addFactor}
					showLevel={false}
					pageType={pageType}
					variables={variables}
				/>
				{goToFactorsPage ? (
					<ButtonContainer>
						<DefaultButton onClick={goToFactorsPage}>
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
