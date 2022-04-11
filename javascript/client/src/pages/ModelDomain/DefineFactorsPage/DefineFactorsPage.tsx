/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { Container, Title } from '~styles'

import { FactorsTable } from './FactorsTable'
import { useBusinessLogic } from './hooks'

const tableHeader = [
	{ fieldName: 'variable', value: 'Label' },
	{ fieldName: 'exposure', value: 'Causes Exposure' },
	{ fieldName: 'outcome', value: 'Causes Outcome' },
	{ fieldName: 'reasoning', value: 'Reasoning' },
]

export const DefineFactorsPage: React.FC = memo(function DefineFactorsPage() {
	const { pageName, goToConsiderCausalFactors } = useBusinessLogic()

	return (
		<Container>
			<Container>
				<FactorsTable headers={tableHeader} />
				<Title data-pw="title">Factors assumed to {pageName}</Title>
			</Container>
			<ButtonContainer>
				<ButtonAdd
					onClick={goToConsiderCausalFactors}
					data-pw="add-new-factor-button"
				>
					Add new factor
				</ButtonAdd>
			</ButtonContainer>
		</Container>
	)
})

const ButtonContainer = styled.div`
	text-align: center;
`

const ButtonAdd = styled(DefaultButton)`
	margin-top: 16px;
`
