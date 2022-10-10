/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@thematic/core'
import styled from 'styled-components'

export const CardsContainer = styled.div`
	width: 200px;
`
export const BoxGroup = styled.div<{
	justifyContent?: string
	alignItems?: string
}>`
	display: flex;
	align-items: ${props => props.alignItems || 'center'};
	gap: 2rem;
	justify-content: ${props => props.justifyContent || 'flex-start'};
`

export const Container = styled.section`
	display: grid;
	grid-template-columns: 40% 30% auto;
	align-items: start;
	gap: 10px;
`

export const Div = styled.div``

export const CheckBoxWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	height: 32px;
`

export const Description = styled.div`
	margin-top: 5px;
`

export const SpinnerContainer = styled.div`
	width: 80px;
`

export const SelectorContainer = styled.div<{ isChecked: boolean }>`
	background-color: ${({
		theme,
		isChecked,
	}: {
		theme: Theme
		isChecked: boolean
	}) =>
		isChecked
			? theme.application().accent().hex()
			: theme.application().faint().hex()};
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	font-weight: bold;
	color: white;
	cursor: pointer;
	padding: 0 10px;
`

export const ConfigContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`
