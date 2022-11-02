/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const PageSection = styled.section`
	margin-bottom: 2rem;
`

export const Box = styled.div``

export const BoxGroup = styled.div<{
	justifyContent?: string
	alignItems?: string
}>`
	display: flex;
	align-items: ${props => props.alignItems || 'center'};
	gap: 2rem;
	justify-content: ${props => props.justifyContent || 'flex-start'};
`

export const Text = styled.span`
	margin-left: 10px;
`

export const Container = styled.article``

export const P = styled.p``
