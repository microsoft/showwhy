/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import styled from 'styled-components'

export const containerPadding = 5
export const padding = {
	paddingLeft: containerPadding,
	paddingRight: containerPadding,
	paddingTop: containerPadding,
	paddingBottom: containerPadding,
}
export const colorRemoved = 'white'
export const colorPositive = '#89be89'
export const colorNeutral = 'rgb(100, 100, 180)'
export const colorNegative = '#be8989'
export const colorPositiveFocused = '#66aa66'
export const colorNeutralFocused = 'rgb(120, 120, 200)'
export const colorNegativeFocused = '#aa6666'
export const colorPositiveFaded = '#66aa6633'
export const colorNeutralFaded = 'rgb(120, 120, 200, 0.3)'
export const colorNegativeFaded = '#aa666633'
export const addedStyle = { filter: 'drop-shadow(-1px 1px 2px #FFAA44)' }
export const colorCorrelation = 'rgb(120, 120, 120)'
export const colorCorrelationFaded = 'rgb(120, 120, 120, 0.5)'

export const IconButtonDark = styled(IconButton)`
	color: ${({ theme }: { theme: ITheme }) => theme.palette.black};
`
