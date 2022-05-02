/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler, Handler1 } from '@showwhy/types'
import { useCallback } from 'react'

export function useHandleOnBlur(
	fn: Handler,
	comparePW?: string[],
): Handler1<React.FocusEvent<HTMLInputElement>> {
	return useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			const { relatedTarget } = event
			const pw = relatedTarget?.getAttribute('data-pw') || ''
			if (!comparePW?.length || !comparePW.includes(pw)) {
				fn()
			}
		},
		[comparePW, fn],
	)
}
