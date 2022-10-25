/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useTableMenuBarStyles() {
	return useMemo(
		() => ({
			root: {
				paddingLeft: 0,
			},
		}),
		[],
	)
}
