/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { useCurrentStep } from 'src/hooks'
import styled from 'styled-components'
import { Container, ContainerFlexRow, Text, Title } from '~styles'

export const UnderstandProcessPage: React.FC = memo(
	function UnderstandProcessPage() {
		const step = useCurrentStep()

		return (
			<Root>
				<ContainerFlexRow justifyContent="space-between">
					<WorkspaceContainer>
						<Title>Learn more about key concepts​</Title>
						{step?.resources?.map(resource => {
							return (
								<LinksContainer key={resource.id}>
									<Text>{resource.title}</Text>
									<LinkContainer>
										{resource.links.map(link => (
											<Link
												rel="noopener"
												target="_blank"
												href={link.url}
												key={link.url}
												title="Open link"
											>
												<LinkDescription>{link.description}</LinkDescription>
												<Container>{link.title}</Container>
											</Link>
										))}
									</LinkContainer>
								</LinksContainer>
							)
						})}
					</WorkspaceContainer>
				</ContainerFlexRow>
			</Root>
		)
	},
)

const Root = styled.div`
	height: 100%;
`

const LinksContainer = styled.div`
	margin-bottom: 16px;
`

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

const WorkspaceContainer = styled.div`
	width: 100%;
	background: #ffffff;
`

const LinkContainer = styled.div`
	overflow: auto;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
`
