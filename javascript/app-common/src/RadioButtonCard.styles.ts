/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@fluentui/react'
import { FontIcon } from '@fluentui/react'
import styled from 'styled-components'

export const Title = styled.h3`
	font-size: 1.1rem;
	font-weight: 500;
	margin: 0;
	display: grid;
	align-items: center;
	grid-template-columns: 5% auto;
	gap: 1rem;
`

export const Option = styled.div`
	padding: 1rem;
	cursor: pointer;
`
export const Icon = styled(FontIcon)`
	color: ${({ theme }: { theme: Theme }) => theme.palette.themePrimary};
`
export const P = styled.p``
