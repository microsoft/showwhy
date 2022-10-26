/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'

export const buttonStyles = {
	root: {
		height: '28px',
	},
}

export const Button = styled(DefaultButton)`
	margin: 0 0 0 0.5rem;
	min-width: 2rem;
`

export const ButtonWrapper = styled.div`
	margin: 0 1rem 0 0;
	display: flex;
`
