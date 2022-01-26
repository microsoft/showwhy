/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

export function useGoToPageHandler(): (url: string) => void {
	const history = useHistory()
	return useCallback(
		(url: string) => {
			history.push(url)
		},
		[history],
	)
}
