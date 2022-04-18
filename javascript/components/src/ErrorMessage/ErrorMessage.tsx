/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { ShortenMessage } from './ShortenMessage.js'

export const ErrorMessage: React.FC<{
	message?: string
	log?: string
	styles?: React.CSSProperties
}> = memo(function ErrorMessage({
	message = 'Undefined error, please try again.',
	log = 'Undefined error, please try again.',
	children,
	styles,
}) {
	if (log) {
		console.error('ErrorMessage:', log)
	}
	return (
		<Container style={styles}>
			<Error title={message}>
				<Icon iconName="IncidentTriangle" />
				{children}
				{!children && message.length > 100 ? (
					<ShortenMessage message={message} />
				) : (
					message
				)}
			</Error>
		</Container>
	)
})

const Container = styled.p`
	margin: 0;
	text-align: center;
`

const Error = styled.small`
	color: ${({ theme }) => theme.application().error};
`
