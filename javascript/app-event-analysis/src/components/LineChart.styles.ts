/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const TooltipContent = styled.div`
	position: fixed;
	text-align: center;
	width: auto;
	height: auto;
	padding: 4px;
	font: 12px sans-serif;
	background: lightblue;
	border: 0px;
	border-radius: 8px;
	pointer-events: none;
	button {
		margin: 10px 5px 5px;
		pointer-events: auto;
	}
`
