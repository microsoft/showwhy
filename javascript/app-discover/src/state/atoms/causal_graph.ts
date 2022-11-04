/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type {
	CausalDiscoveryResult,
	CausalDiscoveryResultPromise,
} from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalGraph } from '../../domain/Graph.js'

export const InModelColumnNamesState = atom<string[]>({
	key: 'InModelColumnNamesState',
	default: [],
})

export const CausalGraphConstraintsState = atom<CausalDiscoveryConstraints>({
	key: 'CausalGraphConstraintsState',
	default: {
		causes: [],
		effects: [],
		manualRelationships: [],
	},
})

export const CausalGraphHistoryState = atom<CausalGraph[]>({
	key: 'CausalGraphHistoryState',
	default: [],
})

export const CausalDiscoveryResultsState = atom<CausalDiscoveryResult>({
	key: 'CausalDiscoveryResultsState',
	default: EMPTY_CAUSAL_DISCOVERY_RESULT,
})

export const LastDiscoverPromiseState = atom<
	CausalDiscoveryResultPromise | undefined
>({
	key: 'LastDiscoverPromiseState',
	default: undefined,
	dangerouslyAllowMutability: true,
})
