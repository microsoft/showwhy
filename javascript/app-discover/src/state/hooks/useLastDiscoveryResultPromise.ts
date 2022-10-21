/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useRef } from 'react'

import type { CausalDiscoveryResultPromise } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'

export function useLastDiscoveryResultPromise(): [
	(newPromise?: CausalDiscoveryResultPromise) => void,
	() => Promise<void>,
] {
	const lastDiscoveryResultPromise = useRef<
		CausalDiscoveryResultPromise | undefined
	>(undefined)

	const cancelLastDiscoveryResultPromise = useCallback(async () => {
		await lastDiscoveryResultPromise.current?.cancel?.()
	}, [lastDiscoveryResultPromise])

	const setLastDiscoveryResultPromise = useCallback(
		(newPromise?: CausalDiscoveryResultPromise) => {
			lastDiscoveryResultPromise.current = newPromise
		},
		[lastDiscoveryResultPromise],
	)

	return [setLastDiscoveryResultPromise, cancelLastDiscoveryResultPromise]
}
