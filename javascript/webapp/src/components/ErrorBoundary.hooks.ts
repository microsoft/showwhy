/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

export function useOnReset() {
	return useCallback(() => {
		// reset the state of your app so the error doesn't happen again
	}, [])
}
