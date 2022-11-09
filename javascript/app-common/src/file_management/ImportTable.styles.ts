/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@fluentui/react'
import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const PropsContainer = styled.div`
	display: flex;
	column-gap: 15px;
	align-items: center;
`
export const FormatContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr;
`
export const Code = styled.pre`
	margin-top: 0.5em;
	padding: 10px;
	border: 1px solid
		${({ theme }: { theme: Theme }) => theme.palette.neutralTertiaryAlt};
`
export const Container = styled.div``
export const ExampleContainer = styled.div`
	width: min-content;
`
export const ExampleLabel = styled(Label)`
	font-weight: normal;
	color: ${({ theme }: { theme: Theme }) => theme.palette.neutralSecondary};
`
export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 5px 10px;
	column-gap: 10px;
	background-color: ${({ theme }: { theme: Theme }) =>
		theme.palette.neutralLighter};
`

export const HeaderTitle = styled.span`
	display: flex;
	font-weight: bold;
	flex-direction: column;
	justify-content: center;
	color: ${({ theme }: { theme: Theme }) => theme.palette.neutralSecondary};
`

export const ModalLabel = styled.span`
	font-weight: bold;
	color: ${({ theme }: { theme: Theme }) => theme.palette.neutralSecondary};
`
export const ModalBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 12px;
	height: 100%;
`
export const Footer = styled.div`
	padding: 10px;
	float: right;
`

export const modalStyles = {
	main: { width: 800, maxHeight: '100%' },
	scrollableContent: { maxHeight: '90vh' },
}
export const buttonChoiceGroupStyles = { alignSelf: 'flex-start' }
