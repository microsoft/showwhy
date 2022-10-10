/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Icon, IconButton } from '@fluentui/react'
import styled from 'styled-components'

export const HeaderContainer = styled.div<{ groupLevel: number }>`
	padding-left: ${({ groupLevel }) => `${groupLevel * 12}px`};
	display: flex;
	gap: 4px;
`

export const LevelButton = styled(IconButton as any)`
	width: 40px;
`

export const HeaderDetailsText = styled.span`
	align-self: center;
	font-weight: bold;
`

export const Bold = styled.b``

export const GridIcon = styled(Icon)`
	padding: 10px;
`
