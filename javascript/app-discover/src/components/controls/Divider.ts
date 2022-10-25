/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const Divider = styled(Label)`
	color: ${({ theme }) => theme.palette.neutralSecondary};
	font-size: 14px;
	display: flex;
	justify-content: center;
	align-content: center;
	&::before,
	&::after {
		content: '';
		height: 1px;
		margin: 8px;
		flex-grow: 1; // both lines will expand to occupy the available space
	}
`
