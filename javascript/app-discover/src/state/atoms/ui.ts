/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import { GraphViewStates } from '../../components/graph/GraphViews.types.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { Selectable } from '../../domain/Selection.js'
import { persistAtomEffect } from '../persistence.js'

const { persistAtom } = recoilPersist()

export const LoadingState = atom<string | undefined>({
	key: 'LoadingState',
	default: undefined,
})

export const StraightEdgesState = atom<boolean>({
	key: 'StraightEdgesState',
	default: false,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const AutoLayoutEnabledState = atom<boolean>({
	key: 'AutoLayoutEnabledState',
	default: true,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const SelectedCausalDiscoveryAlgorithmState =
	atom<CausalDiscoveryAlgorithm>({
		key: 'SelectedCausalDiscoveryAlgorithmState',
		default: CausalDiscoveryAlgorithm.NOTEARS,
	})

export const SelectedObjectState = atom<Selectable>({
	key: 'SelectedObjectState',
	default: undefined,
	effects: [persistAtomEffect],
})

export const WeightThresholdState = atom<number>({
	key: 'WeightThresholdState',
	default: 0.005,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const ConfidenceThresholdState = atom<number>({
	key: 'ConfidenceThresholdState',
	default: 0.0,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const CorrelationThresholdState = atom<number>({
	key: 'CorrelationThresholdState',
	default: 0.2,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const GraphViewState = atom<GraphViewStates>({
	key: 'GraphViewState',
	default: GraphViewStates.CausalView,
})

export const PauseAutoRunState = atom<
	CausalDiscoveryAlgorithm.None | undefined
>({
	key: 'PauseAutoRunState',
	default: undefined,
})
