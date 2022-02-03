/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { PageType } from '~types'

interface HeaderProps {
	pageType: PageType
}
export const Header: React.FC<HeaderProps> = memo(function Header({
	pageType,
}) {
	return (
		<Container>
			<TitleContainer>
				<PageTitle>
					<CapitalizedText>{pageType}</CapitalizedText> variables
				</PageTitle>
				<Subtitle>
					{/* TODO: change this? */}
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
