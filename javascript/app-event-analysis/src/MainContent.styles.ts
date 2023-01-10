/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, useTheme } from '@fluentui/react'
import type { FluentTheme } from '@thematic/fluent'
import { useMemo } from 'react'
import styled from 'styled-components'

export const StyledStack = styled(Stack)`
	.add-treated-unit {
		color: ${({ theme }: { theme: FluentTheme }) => theme.palette.themePrimary};
		cursor: pointer;
	}
	.remove-treated-unit {
		color: ${({ theme }: { theme: FluentTheme }) =>
			theme.application().error().hex()};
		cursor: pointer;
	}

	.treatment-list {
		max-height: 120px;
		overflow-y: auto;
		line-height: normal;
		margin-bottom: 0.5rem;
	}

	.treatment-elements-container {
		display: grid;
		grid-template-columns: 47% 47% 6%;
	}

	.treatment-elements-container > .treatment-element {
		margin-top: 2px;
		margin-bottom: 2px;
	}

	.time-effect-label {
		max-width: 100px;
	}

	.time-effect-selector {
		max-width: calc(100% - 100px);
	}

	.bad-input {
		color: ${({ theme }: { theme: FluentTheme }) =>
			theme.application().error().hex()};
		cursor: pointer;
		align-self: center;
	}

	.stepText {
		color: ${({ theme }: { theme: FluentTheme }) =>
			theme.palette.neutralSecondary};
		font-weight: 600;
		font-size: 16px;
	}
	.stepDesc {
		color: #5a5b5c;
	}

	.leftPanel {
		width: 420px;
		min-width: 420px;
		height: 100%;
	}

	.rightPanel {
	}

	.unit-selection-header {
		justify-content: space-between;
	}

	.tabControl {
		height: 100%;
		display: flex;
		flex-direction: column;

		[role='tabpanel'] {
			padding: 8px;
			flex-grow: 1;
			overflow: auto;
			border-right: 1px solid
				${({ theme }: { theme: FluentTheme }) =>
					theme.palette.neutralTertiaryAlt};
			overflow: hidden auto;
		}
	}

	.colInvalidSelection {
		border-style: solid;
		border-width: 1px;
		border-color: ${({ theme }: { theme: FluentTheme }) =>
			theme.application().error().hex()};
	}

	.attributeClearSelection {
		font-weight: bold;
		&:hover {
			color: ${({ theme }: { theme: FluentTheme }) =>
				theme.application().error().hex()};
			cursor: pointer;
		}
	}

	.filter-data-icon {
		&:hover {
			cursor: pointer;
		}
	}
`

export const DropdownContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
	> * {
		min-width: 0;
	}
`

export const Title = styled.h3`
	margin: 0;
	font-weight: 500;
	text-align: center;
	color: ${({ theme }: { theme: FluentTheme }) =>
		theme.palette.neutralSecondary};
`

export const RightPanelHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ theme }: { theme: FluentTheme }) =>
		theme.palette.neutralLighter};
	border-bottom: 1px solid
		${({ theme }: { theme: FluentTheme }) => theme.palette.neutralTertiaryAlt};
	height: 44px;
	width: 100%;
`

export const hypothesisGroupStyles = {
	root: {
		width: '100%',
	},
	flexContainer: {
		display: 'flex',
		justifyContent: 'space-between',
	},
}

export function usePivotStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				height: 44,
				background: theme.palette.neutralLighter,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
		}),
		[theme],
	)
}
