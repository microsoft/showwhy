/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import type { FluentTheme } from '@thematic/fluent'
import styled from 'styled-components'

export const StyledStack = styled(Stack)`
	.add-treated-unit {
		color: ${({ theme }: { theme: FluentTheme }) => theme.palette.themePrimary};
		cursor: pointer;
	}
	.remove-treated-unit {
		color: ${({ theme }: { theme: FluentTheme }) => theme.application().error().hex()};
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
		color: ${({ theme }: { theme: FluentTheme }) => theme.application().error().hex()};
		cursor: pointer;
		align-self: center;
	}

	.stepText {
		color: #000;
		font-weight: 600;
		&.ms-Label {
			padding: 0;
		}
	}
	.stepDesc {
		color: #5a5b5c;
	}

	.leftPanel {
		max-width: 30vw;
		width: 30vw;
		min-width: 400px;
		height: 100%;
		background: #ffffff;
	}

	.rightPanel {
		min-width: 0;
		// 300px is the width of the suite side panel. It would be nice if we didn't have to consider that side panel width.
		max-width: calc(100vw - 30vw - 300px);
	}

	.unit-selection-header {
		justify-content: space-between;
	}

	.tabControl {
		height: 100%;
		display: flex;
		flex-direction: column;

		[role='tabpanel'] {
			padding: 10px 20px;
			flex-grow: 1;
			overflow: auto;
			box-shadow: 0px 4px 4px 3px rgba(0, 0, 0, 0.25);
			overflow: hidden auto;
			box-sizing: border-box;
		}
	}

	.colInvalidSelection {
		border-style: solid;
		border-width: 1px;
		border-color: ${({ theme }: { theme: FluentTheme }) => theme.application().error().hex()};
	}

	.attributeClearSelection {
		font-weight: bold;
		&:hover {
			color: ${({ theme }: { theme: FluentTheme }) => theme.application().error().hex()};
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

export const Title = styled.h2`
	margin: 0;
	font-weight: 500;
	font-size: 1.2rem;
	text-align: center;
`

export const RightPanelHeader = styled.div`
	display: grid;
	grid-template-columns: 85% 15%;
	align-items: center;
	justify-items: center;
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
