/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@thematic/core'
import styled from 'styled-components'

export const icons = {
	history: { iconName: 'History' },
}

export const DetailsListContainer = styled.div`
	overflow: auto;
	display: flex;
	margin-right: 18px;
	flex-direction: column;
	height: 100%;
	border-right: 1px solid
		${({ theme }: { theme: Theme }) => theme.application().faint().hex()};
`

export const Container = styled.div<{ isCollapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ isCollapsed }) =>
		isCollapsed ? '100% 0' : 'calc(100% - 280px) 280px '};
`

export const buttonStyles = {
	wrapper: {
		padding: '10px 0px',
		height: '50%',
		backgroundColor: 'inherit',
	},
}
