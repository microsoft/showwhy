/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'

interface MessageContainerProps {
	type: string
}

export const MessageContainer: React.FC<MessageContainerProps> = memo(
	function MessageContainer({ children, type }) {
		return <ResultContainer type={type}>{children}</ResultContainer>
	},
)

const ResultContainer = styled.div<{ type: string }>`
	color: ${({ theme, type }) => theme.application()[type]};
	border: 1px solid ${({ theme, type }) => theme.application()[type]};
	padding: 8px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
	margin-top: 8px;
`
