/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

export const Card: React.FC<{
	title?: string
	actionButtons?: React.ReactNode
	styles?: React.CSSProperties
	isSticky?: boolean
}> = memo(function CardComponent({
	title,
	actionButtons,
	children,
	styles = {},
	isSticky = false,
}) {
	return (
		<Container isSticky={isSticky} style={styles}>
			{title || actionButtons ? (
				<Title>
					{title || null}
					{actionButtons ? (
						<ButtonContainer>{actionButtons}</ButtonContainer>
					) : null}
				</Title>
			) : null}
			<Content>{children}</Content>
		</Container>
	)
})

const Container = styled.div<{ isSticky: Maybe<boolean> }>`
	padding: 8px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
	margin: 8px;
	display: flex;
	flex-direction: column;
	max-width: 100%;
	width: auto;
	position: relative;
	border: 1px solid #c5c5c5;
	${({ isSticky }) =>
		!isSticky
			? ''
			: `
		position: sticky;
		position: -webkit-sticky;
		z-index: 2;
		bottom: 0.2rem;
		
		background-color: white;
		padding: 1rem;
		
	`}
`

const Title = styled.h4`
	margin-top: unset;
	align-items: center;
	display: flex;
	justify-content: space-between;
`
const Content = styled.div`
	justify-content: space-between;
	align-items: center;
`

const ButtonContainer = styled.div`
	position: absolute;
	right: 0;
`
