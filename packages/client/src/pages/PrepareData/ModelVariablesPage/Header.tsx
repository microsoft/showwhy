/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { usePageType } from '../../../hooks/usePageType'
import styled from 'styled-components'

export const Header: React.FC = memo(function Header() {
	const type = usePageType()
	return (
		<Container>
			<TitleContainer>
				<PageTitle>
					<CapitalizedText>{type}</CapitalizedText> variables
				</PageTitle>
				<Subtitle>
					Derive variables for each of your definitions in the table below
				</Subtitle>
			</TitleContainer>
		</Container>
	)
})

const Container = styled.header`
	display: flex;
	align-items: center;
`

const PageTitle = styled.h3`
	margin: unset;
`

const Subtitle = styled.small`
	font-weight: normal;
	align-self: center;
`

const TitleContainer = styled.div`
	margin: 8px 0px;
	display: flex;
	justify-content: space-between;
	width: 100%;
`

const CapitalizedText = styled.span`
	text-transform: capitalize;
`
