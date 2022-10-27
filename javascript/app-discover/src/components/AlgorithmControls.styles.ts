/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div``

export const Section = styled.div`
	padding: 8px;
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt};
`
