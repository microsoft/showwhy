/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useCallback } from 'react'

import { useSetConfidenceInterval } from '~state'

export function useToggleConfidenceInterval(): Handler {
	const setConfidenceInterval = useSetConfidenceInterval()
	return useCallback(() => {
		setConfidenceInterval(prev => !prev)
	}, [setConfidenceInterval])
}
