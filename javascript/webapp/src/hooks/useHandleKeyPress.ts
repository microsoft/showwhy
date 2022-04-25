/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler, Handler1 } from '@showwhy/types'
import { useCallback } from 'react'

export function useHandleKeyPress(
	fn: Handler,
	key = 'enter',
): Handler1<React.KeyboardEvent<HTMLInputElement>> {
	return useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key.toLowerCase() === key || event.code.toLowerCase() === key) {
				fn()
			}
		},
		[key, fn],
	)
}
