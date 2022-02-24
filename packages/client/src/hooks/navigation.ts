/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import type { Handler } from '~types'

export function useGoToPage(url: string, state?: unknown): Handler {
	const history = useHistory()
	return useCallback(() => {
		history.push(url)
		if (state) {
			history.location.state = state
		}
	}, [history, url, state])
}
