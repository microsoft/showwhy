/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ITheme } from '@fluentui/react'
import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div``

export const ParserOptionsContainer = styled.div`
	padding: 10px;
`
export const TableFormatContainer = styled.div`
	display: flex;
	column-gap: 30px;
`

export const RadioBoxLabel = styled(Label)`
	padding: unset;
`

export const tabeLayoutOptionsStyle = {
	flexContainer: {
		display: 'flex',
		columnGap: '10px',
	},
}

export const textFieldStyles = { fieldGroup: { width: 70 } }
export const checkboxContainerStyle = { alignItems: 'center' }
export const spinButtonStyles = {
	label: { lineHeight: 'inherit' },
	root: { width: 50 },
}

export const Grid = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 0px 30px;
`

export const FieldContainer = styled.div`
	display: flex;
	column-gap: 10px;
`

export const PreviewContainer = styled.div``

export const PreviewLabel = styled(Label)`
	margin-top: 10px;
	padding-left: 10px;
	color: ${({ theme }: { theme: ITheme }) => theme.palette.neutralSecondary};
`
