/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-call */
import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const Divider = styled(Label)`
	display: flex;
	justify-content: center;
	align-content: center;
	&::before,
	&::after {
		content: '';
		height: 1px;
		margin: 8px;
		background-color: ${({ theme }) => theme.application().lowContrast()};
		flex-grow: 1; // both lines will expand to occupy the available space
	}
`
