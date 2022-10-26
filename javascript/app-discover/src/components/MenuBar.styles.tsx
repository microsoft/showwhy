/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'

export const toggleStyles = {
	root: {
		display: 'flex',
		alignItems: 'center',
		margin: '0 1rem',
	},
	label: {
		margin: '0 0 0 0.5rem',
	}
}

export const Button = styled(DefaultButton)`
	margin: 0 0 0 0.5rem;
	min-width: 2rem;
`

export const ButtonWrapper = styled.div`
	margin: 0 1rem 0 0;
	display: flex;
`
