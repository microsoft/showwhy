/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

export const icons = {
	history: { iconName: 'History' },
}

export const DetailsListContainer = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-right: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
`

export const Container = styled.div<{ collapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ collapsed }) =>
		collapsed ? '100% 0' : 'calc(100% - 280px) 280px '};
`

export const buttonStyles = {
	wrapper: {
		padding: '10px 0px',
		height: '50%',
		backgroundColor: 'inherit',
	},
}

export function useTableHeaderColors() {
	const theme = useTheme()
	return useMemo(
		() => ({
			background: theme.palette.neutralLighter,
			border: theme.palette.neutralTertiaryAlt,
		}),
		[theme],
	)
}

export function useTableHeaderStyles() {
	const colors = useTableHeaderColors()
	return useMemo(
		() => ({
			root: {
				height: 44,
				borderBottom: `1px solid ${colors.border}`,
			},
		}),
		[colors],
	)
}

export function useTableCommandProps() {
	const colors = useTableHeaderColors()
	return useMemo(
		() => ({
			background: colors.background,
			commandBarProps: {
				styles: {
					root: {
						height: 43,
					},
				},
			},
		}),
		[colors],
	)
}

export function useToolPanelStyles() {
	const colors = useTableHeaderColors()
	return useMemo(
		() => ({
			root: {
				borderLeft: `1px solid ${colors.border}`,
			},
			header: {
				height: 46,
				background: colors.background,
				borderBottom: `1px solid ${colors.border}`,
			},
		}),
		[colors],
	)
}
