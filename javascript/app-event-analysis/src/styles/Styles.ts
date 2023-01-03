/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme, ITooltipHostStyles } from '@fluentui/react'
import { Stack } from '@fluentui/react'
import type { Theme } from '@thematic/core'
import type { FluentTheme } from '@thematic/fluent'
import styled from 'styled-components'

export const Container = styled.div``
export const Section = styled.section``
export const Strong = styled.strong``

export const Page = styled.article<{ isGrid?: boolean; isFlex?: boolean }>`
	padding: 8px;
	margin-bottom: 5rem;
	overflow-y: auto;
	height: 90vh;

	${({ isGrid }) =>
		isGrid
			? `
		display: grid;
    grid-template-columns: 25% 75%;
		`
			: ''}

	${({ isFlex }) =>
		isFlex
			? `
		display: flex;
		gap: 1rem;
		flex-direction: column;
	`
			: ''}
`
export const ConfigContainer = styled.section<{ isFlex?: boolean }>`
	padding: 0 0.5rem 0 0;
	border-right: 1px solid
		${({ theme }: { theme: FluentTheme }) => theme.palette.neutralTertiaryAlt};

	${({ isFlex }) =>
		isFlex
			? `
		display: flex;
		gap: 1rem;
		flex-direction: column;
	`
			: ''}
`
export const GraphContainer = styled.section``

export const StepTitle = styled.h3`
	color: ${({ theme }: { theme: FluentTheme }) =>
		theme.palette.neutralSecondary};
	font-weight: 600;
	font-size: 16px;
	margin: 0 0 0.5rem;
`

export const StepDescription = styled.p`
	margin: 0 0 0.5rem 0;
`

export const StyledStack = styled(Stack)`
	padding: 10px 20px;
	height: calc(100vh - 87px);
	overflow: hidden auto;

	.italic {
		font-style: italic;
	}

	.light {
		color: dimgray;
		font-weight: 600;
	}

	.bottom-gap {
		margin-bottom: 6px;
		display: block;
	}

	.no-top-margin {
		margin-top: 0;
	}

	.last-item-margin {
		margin-bottom: 2rem;
		display: inline-block;
	}

	.infoItem {
		background-color: lightgoldenrodyellow;
		margin: 4px;
	}

	.synth-control-text-margin {
		padding-bottom: 0.5rem;
	}

	.infoText {
		line-height: 1.4;
		.negative {
			color: #991d32;
		}
		.positive {
			color: #008000;
		}
		.help-link {
			cursor: help;
			position: relative;
			border-bottom: 1px dotted
				${({ theme }: { theme: ITheme }) => theme.palette.neutralPrimary};
		}
		.help-link:before {
			content: attr(data-hover);
			visibility: hidden;
			opacity: 0;
			width: 140px;
			background-color: dimgray;
			color: #fff;
			text-align: center;
			border-radius: 5px;
			transition: opacity 1s ease-in-out;
			font-weight: normal;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 110%;
			padding: 5px 0;
			min-width: 300px;
		}
		.help-link:hover:before {
			opacity: 1;
			visibility: visible;
		}
	}

	.statusMessage {
	}

	.chartContainer {
		min-height: 0;
	}

	.summary-list {
		max-height: 200px;
		overflow-y: auto;
		line-height: normal;
	}

	.control-label {
		color: ${({ theme }: { theme: Theme }) =>
			theme.scales().nominal()(3).hex()};
	}
`

export const GraphTitle = styled.h3`
	margin: 0;
	text-transform: uppercase;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`

export const TreatedTitle = styled.h4`
	margin: 0;
	font-size: 16px;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`

export const tooltipHostStyles: Partial<ITooltipHostStyles> = {
	root: {
		display: 'inline-block',
		verticalAlign: 'middle',
		marginLeft: '0.5rem',
	},
}
