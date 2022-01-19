/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

export function useOnDropRejected(
	onError?: (text: string) => void,
	cb?: () => void,
): (message: string) => void {
	return useCallback(
		(message: string) => {
			onError && onError(message)
			cb && cb()
		},
		[onError, cb],
	)
}
