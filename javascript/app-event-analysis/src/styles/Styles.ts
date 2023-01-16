/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme, ITooltipHostStyles } from '@fluentui/react'
import type { FluentTheme } from '@thematic/fluent'
import styled from 'styled-components'

export const Container = styled.div``
export const Section = styled.section``
export const Strong = styled.strong``

export const Page = styled.article<{
	isGrid?: boolean
	isFlex?: boolean
}>`
	padding: 8px;
	margin-bottom: 5rem;
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
	overflow: hidden auto;
	padding: 0 0.5rem 2rem 0;
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
export const GraphContainer = styled.section<{ overflow?: boolean }>`
	${({ overflow }) =>
		overflow
			? `
		overflow: hidden auto;
	`
			: ''}
`

export const StepTitle = styled.h3`
	color: ${({ theme }: { theme: FluentTheme }) =>
		theme.palette.neutralSecondary};
	font-weight: 600;
	font-size: 16px;
	margin: 0 0 0.5rem;
`

export const PaneContainer = styled.div`
	padding: 10px 20px;
	height: calc(100vh - 87px);
	overflow: hidden auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`

export const StepDescription = styled.p`
	margin: 0 0 0.5rem 0;
`

export const GraphTitle = styled.h3`
	margin: 0;
	text-transform: uppercase;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`

export const TreatedTitle = styled.h4`
	margin: 0 0 1rem;
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
