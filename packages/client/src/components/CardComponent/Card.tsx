/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'

interface CardProps {
	title?: string
	actionButtons?: React.ReactNode
	styles?: React.CSSProperties
	isSticky?: boolean
}

export const CardComponent: React.FC<CardProps> = memo(function CardComponent({
	title,
	actionButtons,
	children,
	styles = {},
	isSticky = false,
}) {
	return (
		<Card isSticky={isSticky} style={styles}>
			{title || actionButtons ? (
				<CardTitle>
					{title || null}
					{actionButtons ? (
						<ButtonContainer>{actionButtons}</ButtonContainer>
					) : null}
				</CardTitle>
			) : null}
			<CardContent>{children}</CardContent>
		</Card>
	)
})

const Card = styled.div<{ isSticky: boolean | undefined }>`
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

const CardTitle = styled.h4`
	margin-top: unset;
	align-items: center;
	display: flex;
	justify-content: space-between;
`
const CardContent = styled.div`
	justify-content: space-between;
	align-items: center;
`

const ButtonContainer = styled.div`
	position: absolute;
	right: 0;
`
