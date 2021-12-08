/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import React, { memo } from 'react'
import styled from 'styled-components'

interface LinkCalloutProps {
	title?: string
	id?: string
	detailsTitle?: string
}

export const LinkCallout: React.FC<LinkCalloutProps> = memo(
	function LinkCallout({ title, children, id = 'callout-link', detailsTitle }) {
		const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
			useBoolean(false)

		return (
			<>
				<Text id={id} onClick={toggleIsCalloutVisible}>
					{title}
				</Text>
				{isCalloutVisible && (
					<CalloutInfo
						role="alertdialog"
						gapSpace={0}
						onDismiss={toggleIsCalloutVisible}
						setInitialFocus
						target={`#${id}`}
					>
						{title && !detailsTitle && <CalloutTitle>{title}</CalloutTitle>}
						{detailsTitle && <CalloutTitle>{detailsTitle}</CalloutTitle>}
						{children}
					</CalloutInfo>
				)}
			</>
		)
	},
)

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

const CalloutInfo = styled(Callout)`
	div.ms-Callout-main {
		width: 320px;
		padding: 20px 24px;
	}
`
