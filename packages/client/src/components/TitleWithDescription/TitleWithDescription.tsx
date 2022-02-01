/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

export const TitleWithDescription: React.FC<{
	title: string
	description?: string
}> = memo(function TitleWithDescription({ title, description }) {
	return (
		<Container>
			<Title>{title}</Title>
			<Description>{description}</Description>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding: 4px 8px;
`

const Title = styled.span`
	font-size: 18px;
`
const Description = styled.small`
	color: ${({ theme }) => theme.application().midContrast};
`
