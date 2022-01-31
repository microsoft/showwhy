/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import styled from 'styled-components'

export const EmptySteps: FC = memo(function EmptySteps() {
	return (
		<Container>
			<span>Derive a new column in the table below to start</span>
		</Container>
	)
})

const Container = styled.div`
	height: 100px;
	margin: 8px 8px 8px 0px;
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
	color: ${({ theme }) => theme.application().border().hex()};
	padding: 8px;
	width: 20%;
	font-weight: bold;
	display: flex;
	flex-direction: column;
	justify-content: center;
`
