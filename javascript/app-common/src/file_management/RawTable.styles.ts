/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import { MessageBar } from '@fluentui/react'
import styled from 'styled-components'

export const DatasetContainer = styled.div`
	max-height: calc(100% - 82px);
	height: 100%;
`

export const DetailsContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`
export const DetailsText = styled.span`
	font-size: 11px;
	padding-right: 12px;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`
export const Message = styled(MessageBar)`
	margin-top: 10px;
`

export const DetailsListContainer = styled.div`
	height: 250px;
	border-top: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt};
`
