/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

export const WorkflowTitle: React.FC<{
	title: string
}> = memo(function WorkflowTitle({ title }) {
	return (
		<Container>
			<Title>{title}</Title>
		</Container>
	)
})

const Container = styled.div`
	background-color: ${({ theme }) => theme.application().midContrast};
	padding: 8px 16px;
	height: 18px;
`

const Title = styled.span`
	color: white;
	font-weight: bold;
`
