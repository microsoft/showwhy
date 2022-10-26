/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import { GraphViewStates } from '../../components/graph/GraphViews.types.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { Selectable } from '../../domain/Selection.js'

export const ErrorMessageState = atom<string | undefined>({
	key: 'ErrorMessageState',
	default: undefined,
})

export const LoadingState = atom<string | undefined>({
	key: 'LoadingState',
	default: undefined,
})

export const StraightEdgesState = atom<boolean>({
	key: 'StraightEdgesState',
	default: false,
})

export const AutoLayoutEnabledState = atom<boolean>({
	key: 'AutoLayoutEnabledState',
	default: false,
})

export const FixedInterventionRangesEnabledState = atom<boolean>({
	key: 'FixedInterventionRangesEnabledState',
	default: true,
})

export const SelectedCausalDiscoveryAlgorithmState =
	atom<CausalDiscoveryAlgorithm>({
		key: 'SelectedCausalDiscoveryAlgorithmState',
		default: CausalDiscoveryAlgorithm.NOTEARS,
	})

export const SelectedObjectState = atom<Selectable>({
	key: 'SelectedObjectState',
	default: undefined,
})

export const WeightThresholdState = atom<number>({
	key: 'WeightThresholdState',
	default: 0.005,
})

export const ConfidenceThresholdState = atom<number>({
	key: 'ConfidenceThresholdState',
	default: 0.0,
})

export const CorrelationThresholdState = atom<number>({
	key: 'CorrelationThresholdState',
	default: 0.2,
})

export const GraphViewState = atom<GraphViewStates>({
	key: 'GraphViewState',
	default: GraphViewStates.CausalView,
})

export const AutoRunState = atom<boolean>({
	key: 'AutoRunState',
	default: false,
})
