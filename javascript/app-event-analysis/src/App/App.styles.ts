/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

export const Container = styled.article`
	overflow: auto;
	.container {
		min-height: 0;
		min-width: 0;
	}
`

export function usePivotStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				height: 44,
				background: theme.palette.neutralLighter,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
		}),
		[theme],
	)
}
