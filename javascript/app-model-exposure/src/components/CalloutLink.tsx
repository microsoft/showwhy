/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'

import { BaseCallout } from './Callout.js'
/* eslint-disable */
export const LinkCallout: React.FC<{
	title?: string
	id?: string
	detailsTitle?: string
	noUnderline?: boolean
	children?: React.ReactNode
}> = memo(function LinkCallout({
	title,
	id = 'callout-link',
	detailsTitle,
	noUnderline,
	children,
}) {
	const [isVisible, { toggle: handleToggleVisible }] = useBoolean(false)

	return (
		<>
			<Text noUnderline={noUnderline} id={id} onClick={handleToggleVisible}>
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

const Text = styled.span<{ noUnderline?: boolean }>`
	text-decoration: ${({ noUnderline }) => (noUnderline ? 'none' : 'underline')};
	cursor: pointer;
	color: ${({ theme }) => theme.palette.themePrimary};
	margin: 0;
`

const CalloutTitle = styled.h3`
	margin-bottom: 12;
	font-weight: bold;
`
