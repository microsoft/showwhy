/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Spinner } from '@fluentui/react'
import styled from 'styled-components'

export const Title = styled.h3<{
	noMarginBottom?: boolean | undefined
	noMarginTop?: boolean | undefined
}>`
	margin-bottom: ${({ noMarginBottom }) => (noMarginBottom ? 'unset' : '1em')};
	margin-top: ${({ noMarginTop }) => (noMarginTop ? 'unset' : '1em')};
`

export const Text = styled.span<{ marginTop?: boolean | undefined }>`
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
	color?: string
	noMarginBottom?: boolean | undefined
	noMarginTop?: boolean | undefined
}>`
	color: ${({ color, theme }) =>
		color ? theme.application()[color] : 'black'};
	margin-bottom: ${({ noMarginBottom }) => (noMarginBottom ? 'unset' : '1em')};
	margin-top: ${({ noMarginTop }) => (noMarginTop ? 'unset' : '1em')};
`

export const Container = styled.div<{
	marginTop?: boolean | undefined
	marginBottom?: boolean | undefined
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

export const ContainerFlexRow = styled(Container)<{ justifyContent?: string }>`
	display: flex;
	flex-direction: row;
	justify-content: ${({ justifyContent }) => justifyContent};
`

export const StyledSpinner = styled(Spinner)`
	margin-top: 20px;
`
