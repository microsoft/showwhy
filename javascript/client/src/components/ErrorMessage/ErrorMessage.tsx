/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

export const ErrorMessage: React.FC<{
	message?: string
	styles?: React.CSSProperties
}> = memo(function ErrorMessage({
	message = 'Undefined error, please try again.',
	children,
	styles,
}) {
	return (
		<Container style={styles}>
			<Error>
				<Icon iconName="IncidentTriangle" />
				{children ?? message}
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