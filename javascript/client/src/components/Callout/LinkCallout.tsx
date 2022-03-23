/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'

import { BaseCallout } from './BaseCallout'

export const LinkCallout: React.FC<{
	title?: string
	id?: string
	detailsTitle?: string
}> = memo(function LinkCallout({
	title,
	children,
	id = 'callout-link',
	detailsTitle,
}) {
	const [isVisible, { toggle: handleToggleVisible }] = useBoolean(false)

	return (
		<>
			<Text id={id} onClick={handleToggleVisible}>
				{title}
			</Text>
			<BaseCallout show={isVisible} toggleShow={handleToggleVisible} id={id}>
				{title && !detailsTitle && <CalloutTitle>{title}</CalloutTitle>}
				{detailsTitle && <CalloutTitle>{detailsTitle}</CalloutTitle>}
				{children}
			</BaseCallout>
		</>
	)
})

const Text = styled.span`
	text-decoration: underline;
	cursor: pointer;
	color: ${({ theme }) => theme.application().accent};
	margin: 0;
`

const CalloutTitle = styled.h3`
	margin-bottom: 12;
	font-weight: bold;
`
