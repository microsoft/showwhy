/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { Container, Title } from '~styles'

import { useBusinessLogic } from './ConsiderVariableRelationshipsPage.hooks'
import { FactorsTable } from './FactorsTable'

export const ConsiderVariableRelationshipsPage: React.FC = memo(
	function ConsiderVariableRelationshipsPage() {
		const { goToRelevantVariables } = useBusinessLogic()

		return (
			<Container>
				<Container>
					<Title data-pw="title">Variable relationships</Title>
					<FactorsTable />
				</Container>
				<ButtonContainer>
					<ButtonAdd
						onClick={goToRelevantVariables}
						data-pw="add-new-factor-button"
					>
						Add new factor
					</ButtonAdd>
				</ButtonContainer>
			</Container>
		)
	},
)

const ButtonContainer = styled.div`
	text-align: center;
`

const ButtonAdd = styled(DefaultButton)`
	margin-top: 16px;
`
