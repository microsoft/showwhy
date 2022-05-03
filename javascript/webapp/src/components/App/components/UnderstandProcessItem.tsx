/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import { Text } from '@showwhy/components'
import type { WorkflowHelp } from '@showwhy/types'
import Markdown from 'markdown-to-jsx'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'
import { UnderstandProcessLink } from './UnderstandProcessLink'

export const UnderstandProcessItem: FC<{
	markdown: string
	workflow: WorkflowHelp
}> = memo(function UnderstandProcessItem({ markdown, workflow }) {
	return (
		<ContainerFlex>
			<Flex>
				<Markdown>{markdown}</Markdown>
			</Flex>
			<Separator vertical />
			<Flex>
				{workflow?.resources?.map(resource => {
					return (
						<LinksContainer key={resource.id}>
							<Text>{resource.title}</Text>
							<LinkContainer>
								{resource.links.map(link => (
									<UnderstandProcessLink key={link.title} link={link} />
								))}
							</LinkContainer>
						</LinksContainer>
					)
				})}
			</Flex>
		</ContainerFlex>
	)
})

const ContainerFlex = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-top: 12px;
`

const Flex = styled.div`
	width: 50%;
	padding: 0px 12px;
`

const LinkContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
`

const LinksContainer = styled.div`
	margin-bottom: 16px;
`
