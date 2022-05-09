/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import { Container, DetailsList, Title } from '@showwhy/components'
import { memo } from 'react'
import styled from 'styled-components'

import { useDetailsList } from './hooks/useDetailsList'
import { useFactorsNavigation } from './hooks/useFactorsNavigation'
import { RelevantVariablesForm } from './RelevantVariablesForm'

export const ConsiderRelevantVariablesPage: React.FC = memo(
	function ConsiderRelevantVariablesPage() {
		const { items, addFactor, ref, headers } = useDetailsList()
		const [goToFactorsPage, factorsPathData] = useFactorsNavigation()

		return (
			<Container>
				<Container>
					<Title data-pw="title">Relevant variables</Title>
					<Container ref={ref}>
						<DetailsList items={items} headers={headers} />
					</Container>
				</Container>
				<RelevantVariablesForm onAdd={addFactor}></RelevantVariablesForm>
				{factorsPathData?.page ? (
					<ButtonContainer>
						<DefaultButton onClick={goToFactorsPage} data-pw="go-back-button">
							Go back to {factorsPathData?.page} page
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
