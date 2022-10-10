/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@datashaper/workflow'
import styled from 'styled-components'

export const Card = styled.div<{
	isSticky: Maybe<boolean>
	noShaddow?: boolean
}>`
	padding: 8px;
	box-shadow: ${({ noShaddow }) =>
		noShaddow ? 'unset' : '0px 4px 4px rgba(0, 0, 0, 0.25)'};
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

export const CardTitle = styled.h4`
	margin-top: unset;
	align-items: center;
	display: flex;
	justify-content: space-between;
`
export const CardContent = styled.div`
	justify-content: space-between;
	align-items: center;
`

export const ButtonContainer = styled.div`
	position: absolute;
	right: 0;
`
