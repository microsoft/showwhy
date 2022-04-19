/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import { Pages } from 'src/constants'
import styled from 'styled-components'

import { useGoToPage } from '~hooks'
import { Container, Title } from '~styles'

import { tableHeader } from './ConsiderVariableRelationshipsPage.constants'
import { FactorsTable } from './FactorsTable'
import { useSetPageDone } from './hooks/useSetPageDone'

export const ConsiderVariableRelationshipsPage: React.FC = memo(
	function ConsiderVariableRelationshipsPage() {
		const goToRelevantVariables = useGoToPage(
			Pages.RelevantVariables,
			Pages.RelevantVariables,
		)
		useSetPageDone()

		return (
			<Container>
				<Container>
					<Title data-pw="title">Variable relationships</Title>
					<FactorsTable headers={tableHeader} />
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
