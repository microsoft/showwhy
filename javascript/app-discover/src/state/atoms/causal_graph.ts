/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryResult } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalGraph } from '../../domain/Graph.js'
import { persistence } from './persistence.js'

export const InModelColumnNamesState = atom<string[]>({
	key: 'InModelColumnNamesState',
	default: [],
	...persistence,
})

export const CausalGraphConstraintsState = atom<CausalDiscoveryConstraints>({
	key: 'CausalGraphConstraintsState',
	default: {
		causes: [],
		effects: [],
		manualRelationships: [],
	},
	...persistence,
})

export const CausalGraphHistoryState = atom<CausalGraph[]>({
	key: 'CausalGraphHistoryState',
	default: [],
	// eslint-disable-next-line camelcase
	// effects_UNSTABLE: [persistAtom],
})

export const CausalDiscoveryResultsState = atom<CausalDiscoveryResult>({
	key: 'CausalDiscoveryResultsState',
	default: EMPTY_CAUSAL_DISCOVERY_RESULT,
})
