/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { Container, Title } from '@showwhy/components'
import { memo } from 'react'
import { Pages } from 'src/constants'
import styled from 'styled-components'

import { useGoToPage } from '~hooks'

import { FactorsTable } from './FactorsTable'
import { useSetPageDone } from './hooks/useSetPageDone'

export const ConsiderVariableRelationshipsPage: React.FC = memo(
	function ConsiderVariableRelationshipsPage() {
		const goToRelevantVariables = useGoToPage(
			'consider variable relationships',
			Pages.RelevantVariables,
		)
		useSetPageDone()

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
