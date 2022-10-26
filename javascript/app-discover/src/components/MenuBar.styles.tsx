/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'

export const toggleStyles = {
	root: {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center',
		margin: '0 1rem',
	},
}

export const Button = styled(DefaultButton)`
	margin: 0 0 0 0.5rem;
	min-width: 2rem;
`
