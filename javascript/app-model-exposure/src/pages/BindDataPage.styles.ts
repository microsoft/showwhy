/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	height: 99%;
	position: relative;
	overflow-y: auto;

	> div {
		padding: 0;
	}
`

export const PrepareDataContainer = styled.div`
	height: 95%;
`

export const ActionsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	background: ${({ theme }: { theme: ITheme }) =>
		theme.palette.neutralLighterAlt};
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralQuaternaryAlt};
`

export const ElementsContainer = styled.div`
	padding: 6px;
`
export const commandBarStyles = { root: { width: 200, paddingBottom: 6 } }

export const NoticeContainer = styled.div`
	padding: 8px;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`
