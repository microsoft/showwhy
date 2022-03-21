/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC} from 'react';
import { memo } from 'react'
import styled from 'styled-components'

import { Container } from '~styles'
import type { ProcessHelpLink } from '~types'

export const UnderstandProcessLink: FC<{ link: ProcessHelpLink }> = memo(
	function UnderstandProcessLink({ link }) {
		return (
			<Link
				rel="noopener"
				target="_blank"
				href={link.url}
				key={link.url}
				title="Open link"
				data-pw="resource-link"
			>
				<LinkDescription>{link.description}</LinkDescription>
				<Container>{link.title}</Container>
			</Link>
		)
	},
)

const LinkDescription = styled.div`
	font-size: 12px;
	color: black;
	margin-bottom: 12px;
`

const Link = styled.a`
	margin: 8px;
	margin-left: unset;
	text-decoration: unset;
	min-width: 150px;
	border: 1px solid ${({ theme }) => theme.application().faint()};
	padding: 16px;

	&:hover {
		background: ${({ theme }) => theme.application().faint()};
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 2px;
	}
`
