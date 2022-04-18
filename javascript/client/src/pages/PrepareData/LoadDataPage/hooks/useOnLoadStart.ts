/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useCallback } from 'react'

export function useOnLoadStart(setLoading: any, onError: any): Handler {
	return useCallback(() => {
		setLoading(true)
		onError && onError(null)
	}, [setLoading, onError])
}
