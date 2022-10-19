/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@fluentui/react'
import { DefaultButton, Icon } from '@fluentui/react'
import styled from 'styled-components'

export const Button = styled(DefaultButton)`
	margin: 8px;
	display: flex;
	min-height: 32px;
	span {
		align-self: center;
	}
	border: 1px solid;
	${({ checked, theme }: { checked: boolean; theme: Theme }) =>
		checked ? theme.palette.themePrimary : theme.palette.neutralPrimary};
`

export const ButtonIcon = styled(Icon)`
	margin-right: 8px;
`
