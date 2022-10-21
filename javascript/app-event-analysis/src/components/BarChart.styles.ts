/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import styled from 'styled-components'

export const TooltipContent = styled.div`
	position: fixed;
	text-align: center;
	width: auto;
	height: auto;
	padding: 4px;
	font: 12px sans-serif;
	background: ${({ theme }: { theme: Theme }) => theme.tooltip().fill().hex()};
	border: ${({theme}: { theme: Theme }) => `${theme.tooltip().strokeWidth()}px solid ${theme.tooltip().stroke().hex()}`};
	border: 0px;
	border-radius: 2px;
	pointer-events: none;
	button {
		margin: 10px 5px 5px;
		pointer-events: auto;
	}
`
