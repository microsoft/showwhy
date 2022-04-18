/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import type { HeaderData } from '@showwhy/components'
import { GenericTable } from '@showwhy/components'
import { memo } from 'react'
import styled from 'styled-components'

import { Container, Title } from '~styles'

import { useBusinessLogic } from './ConsiderRelevantVariablesPage.hooks'
import { RelevantVariablesForm } from './RelevantVariablesForm'

const tableHeaders: HeaderData[] = [
	{ fieldName: 'variable', value: 'Label' },
	{ fieldName: 'description', value: 'Description' },
	{ fieldName: 'actions', value: 'Actions' },
]

export const ConsiderRelevantVariablesPage: React.FC = memo(
	function ConsiderRelevantVariablesPage() {
		const { items, addFactor, goToFactorsPage, page } = useBusinessLogic()

		return (
			<Container>
				<Container>
					<Title data-pw="title">Relevant variables</Title>
					<Container>
						<GenericTable
							items={items}
							headers={{
								data: tableHeaders,
							}}
							props={{
								customColumnsWidth: [
									{ fieldName: 'label', width: '30%' },
									{ fieldName: 'description', width: '60%' },
									{ fieldName: 'actions', width: '10%' },
								],
							}}
						/>
					</Container>
				</Container>
				<RelevantVariablesForm onAdd={addFactor}></RelevantVariablesForm>
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
