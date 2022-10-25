/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import { Spinner } from '@fluentui/react'
import styled from 'styled-components'

import type { Maybe } from '../types/primitives.js'

export const Title = styled.h3<{
	noMarginBottom?: Maybe<boolean>
	noMarginTop?: Maybe<boolean>
}>`
	margin-bottom: ${({ noMarginBottom }) =>
		noMarginBottom ? 'unset' : '0.5em'};
	margin-top: ${({ noMarginTop }) => (noMarginTop ? 'unset' : '1em')};
`

export const Text = styled.span<{ marginTop?: Maybe<boolean> }>`
	margin-top: ${({ marginTop }) => (marginTop ? '1em' : 'unset')};
`

export const Bold = styled.b``

export const Value = styled(Bold)`
	&:before {
		content: ' ';
	}
	&:after {
		content: ' ';
	}
`

export const Paragraph = styled.p<{
	noMarginBottom?: Maybe<boolean>
	noMarginTop?: Maybe<boolean>
}>`
	margin-bottom: ${({ noMarginBottom }) => (noMarginBottom ? 'unset' : '1em')};
	margin-top: ${({ noMarginTop }) => (noMarginTop ? 'unset' : '1em')};
`

export const Container = styled.div<{
	marginTop?: Maybe<boolean>
	marginBottom?: Maybe<boolean>
}>`
	margin-top: ${({ marginTop }) => (marginTop ? '1em' : 'unset')};
	margin-bottom: ${({ marginBottom }) => (marginBottom ? '1em' : 'unset')};
`

export const ContainerTextCenter = styled(Container)`
	text-align: center;
`

export const ContainerFlexColumn = styled(Container)<{
	justifyContent?: string
}>`
	display: flex;
	flex-direction: column;
	justify-content: ${({ justifyContent }) => justifyContent};
`

export const Header = styled.div`
	height: 44px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: ${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt};
`

export const ContainerFlexRow = styled(Container)<{ justifyContent?: string }>`
	display: flex;
	flex-direction: row;
	justify-content: ${({ justifyContent }) => justifyContent};
`

export const StyledSpinner = styled(Spinner)`
	margin-top: 20px;
`
