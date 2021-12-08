/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { FactorsTable } from './FactorsTable'
import { useBusinessLogic } from './hooks'
import { Container } from '~styles'

export const DefineFactorsPage: React.FC = memo(function DefineFactorsPage() {
	const { pageName, causeType, tableHeader, goToConsiderCausalFactors } =
		useBusinessLogic()

	return (
		<Container>
			<Container>
				<FieldTitle>
					Factors assumed to {pageName.includes('caused') ? 'be ' : null}{' '}
					{pageName}
				</FieldTitle>
				<FactorsTable causeType={causeType} headers={tableHeader} />
			</Container>
			<ButtonContainer>
				<ButtonAdd onClick={goToConsiderCausalFactors}>
					Add new factor
				</ButtonAdd>
			</ButtonContainer>
		</Container>
	)
})

const ButtonContainer = styled.div`
	text-align: center;
`

const FieldTitle = styled.h3`
	margin-bottom: unset;
`

const ButtonAdd = styled(DefaultButton)`
	margin-top: 16px;
`
