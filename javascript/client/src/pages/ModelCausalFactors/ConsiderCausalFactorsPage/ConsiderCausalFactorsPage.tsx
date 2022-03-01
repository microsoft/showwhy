/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './ConsiderCausalFactorsPage.hooks'
import { FactorsDefinitionForm } from '~components/FactorsDefinitionForm'
import { DataTable } from '~components/DataTable'
import { Container } from '~styles'
import type { HeaderData } from '~types'

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
					<FieldTitle data-pw="title">Possible causal factors</FieldTitle>
					<DataTable
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
