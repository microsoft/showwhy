/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryResult } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalGraph } from '../../domain/Graph.js'
import { persistAtomEffect } from '../persistence.js'

const { persistAtom } = recoilPersist()

export const InModelColumnNamesState = atom<string[]>({
	key: 'InModelColumnNamesState',
	default: [],
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const CausalGraphConstraintsState = atom<CausalDiscoveryConstraints>({
	key: 'CausalGraphConstraintsState',
	default: {
		causes: [],
		effects: [],
		manualRelationships: [],
	},
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
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
