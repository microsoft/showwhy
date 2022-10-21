/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

import { CausalEffectSize } from './CausalEffectsArrows.constants.js'

export const ControlsTitle = styled.h4`
	margin: unset;
`

export const Container = styled.div<{ size: CausalEffectSize }>`
	background: white;
	display: grid;
	grid-template-rows: 2fr 1fr;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '1em' : '5em'};
	grid-row-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '0em' : '2em'};
	position: relative;
`

export const Box = styled.div`
	grid-column: 1/-1;
	text-align: center;
`

export const ControlsContainer = styled(Box)`
	border: 1px dotted ${({ theme }: { theme: ITheme}) => theme.palette.neutralPrimary};
`

export const ControlsBoxContainer = styled.div<{ size: CausalEffectSize }>`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '3em' : '8em'};
	padding: 16px;
`

export const DottedContainer = styled(ControlsBoxContainer)``

export const Content = styled.div`
	display: flex;
	flex-direction: column;
`
export const Title = styled.h4`
	margin: unset;
`

export const CausalBox = styled.div<{ size: CausalEffectSize; width: number }>`
	justify-self: center;
	font-size: ${({ size }) =>
		size === CausalEffectSize.Small ? '12px' : '14px'};
	border: 1px
		${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt} solid;
	position: relative;
	border-radius: 5px;
	overflow: auto;
	text-align: center;
	padding: 8px;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralPrimary};
	width: ${({ width }) => width}%;
`

export const ArrowLabel = styled.span<{
	size: CausalEffectSize
	color?: string
}>`
	font-weight: bold;
	font-size: ${({ size }) =>
		size === CausalEffectSize.Small ? '12px' : '14px'};
	padding: 0 ${({ color }) => (color ? '4px' : '')};
	color: ${({ color }) => color};
	background-color: white;
`
