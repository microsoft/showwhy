/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

// always ensure the header is dark, regardless of mode
export const Container = styled.div`
	padding: 0 16px 0 16px;
	background: ${({ theme }: { theme: ITheme }) =>
		theme.isInverted
			? theme.palette.neutralQuaternary
			: theme.palette.neutralPrimary};
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) =>
			theme.isInverted
				? theme.palette.neutralTertiary
				: theme.palette.neutralSecondary};
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 42px;
`

export const Title = styled.h1`
	cursor: pointer;
	font-size: 25px;
	align-self: center;
	margin: 0;
	padding: 0;
	color: ${({ theme }: { theme: ITheme }) =>
		theme.isInverted
			? theme.palette.neutralSecondary
			: theme.palette.neutralQuaternary};
`
