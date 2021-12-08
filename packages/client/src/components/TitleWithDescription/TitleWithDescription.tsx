/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'

interface TitleWithDescriptionProps {
	title: string
	description?: string
}

export const TitleWithDescription: React.FC<TitleWithDescriptionProps> = memo(
	function TitleWithDescription({ title, description }) {
		return (
			<Container>
				<Title>{title}</Title>
				<Description>{description}</Description>
			</Container>
		)
	},
)

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
