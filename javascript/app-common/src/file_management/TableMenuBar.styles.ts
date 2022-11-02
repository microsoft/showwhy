/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useTableMenuBarStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				paddingLeft: 0,
				paddingRight: 0,
				background: theme.palette.neutralLighter,
			},
		}),
		[theme],
	)
}
