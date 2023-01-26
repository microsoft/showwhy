/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { useSetRecoilState } from 'recoil'

import type { CausalDiscoveryResultPromise } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { LastDiscoverPromiseState } from '../atoms/causal_graph.js'

export type SetLastDiscoveryResultPromise = SetterOrUpdater<
	CausalDiscoveryResultPromise | undefined
>
export type CancelLastDiscoveryResultPromise = () => void

export function useLastDiscoveryResultPromise(): [
	SetLastDiscoveryResultPromise,
	CancelLastDiscoveryResultPromise,
] {
	const setLastDiscoveryResultPromise = useSetRecoilState(
		LastDiscoverPromiseState,
	)

	const cancelLastDiscoveryResultPromise = useCallback(() => {
		setLastDiscoveryResultPromise((prev) => {
			void prev?.cancel?.()
			return undefined
		})
	}, [setLastDiscoveryResultPromise])

	return [setLastDiscoveryResultPromise, cancelLastDiscoveryResultPromise]
}
