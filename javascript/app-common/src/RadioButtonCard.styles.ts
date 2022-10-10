/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FontIcon } from '@fluentui/react'
import type { Theme } from '@thematic/core'
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
	color: ${({ theme }: { theme: Theme }) => theme.application().accent().hex()};
`
export const P = styled.p``
