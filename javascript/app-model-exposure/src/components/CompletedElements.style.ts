/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton } from '@fluentui/react'
import type { FluentTheme } from '@thematic/fluent'
import styled from 'styled-components'

export const CalloutStyles = {
	calloutMain: {
		display: 'grid',
		gridTemplateColumns: '1fr auto',
		gap: '1rem',
		padding: '0.5rem',
		maxWidth: '40vw',
		minWidth: '20vw',
	},
}

export const Container = styled.section`
	padding: 0 8px;
	margin: 12px 8px 0;
	position: absolute;
	right: 0;
	z-index: 1;
`

export const Ul = styled.ul`
	list-style: none;
	padding: 0.5rem;
	border-radius: 3px;
	margin: 0;
`

export const Li = styled.li<{ complete: boolean; missing: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0 0 0.5rem 0;
	color: ${({
		theme,
		complete,
		missing,
	}: {
		theme: FluentTheme
		complete: boolean
		missing: boolean
	}) =>
		missing
			? theme.application().warning().hex()
			: complete
			? theme.palette.themePrimary
			: theme.palette.neutralPrimary};
	cursor: ${({ complete }) => (complete ? 'pointer' : 'default')};
`

export const AssignAllSubjectsButton = styled(ActionButton)``
