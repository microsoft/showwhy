/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import { Label, MessageBar } from '@fluentui/react'
import styled from 'styled-components'

export const DatasetContainer = styled.div`
	max-height: calc(100% - 82px);
	height: 100%;
`

export const DetailsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 5px 0px;
`
export const DetailsText = styled.span`
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`
export const Message = styled(MessageBar)`
	margin-top: 10px;
`

export const DetailsLabel = styled(Label)`
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`
