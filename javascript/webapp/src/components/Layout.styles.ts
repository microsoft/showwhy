/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`
export const Main = styled.main`
	flex: 1;
	display: flex;
	flex-direction: row;
	max-height: calc(100vh - 42px);
	max-width: 100%;
	min-height: calc(100vh - 42px);
`
export const Content = styled.article`
	flex: 1;
	display: flex;
	overflow: hidden;
	max-height: 100%;
	max-width: 100%;
`

export function useFileTreeStyle() {
	const theme = useTheme()
	return useMemo(
		() => ({
			borderRight: `2px solid ${theme.palette.neutralTertiaryAlt}`,
		}),
		[theme],
	)
}
