/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICommandBarStyleProps,
	ICommandBarStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export const checkboxStyles = { root: { margin: '5px 5px' } }
export const toggleStyles = {
	root: {
		margin: 0,
	},
	label: {
		marginLeft: 4,
	},
}

export const layoutButtonStyles = {
	splitButtonContainer: {
		marginRight: '3px',
	},
}

export function useCommandBarStyles(): IStyleFunctionOrObject<
	ICommandBarStyleProps,
	ICommandBarStyles
> {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				padding: 0,
				paddingRight: 4,
				background: theme.palette.neutralLighter,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
			secondarySet: { display: 'flex', gap: 18, alignItems: 'center' },
		}),
		[theme],
	)
}

export function useMenuButtonStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				background: theme.palette.neutralLighter,
			},
		}),
		[theme],
	)
}
