/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, selector } from 'recoil'

import type {
	CausalInferenceModel,
	Intervention,
} from '../domain/CausalInference.js'
import { CausalDiscoveryResultsState } from './CausalGraphState.js'

export const CausalInferenceModelState = selector<CausalInferenceModel | null>({
	key: 'CausalInferenceModel',
	get({ get }) {
		return get(CausalDiscoveryResultsState).causalInferenceModel
	},
})

export const CausalInferenceSupportedState = selector<boolean>({
	key: 'CausalInferenceSupportedState',
	get({ get }) {
		return get(CausalInferenceModelState) !== null
	},
})

export const CausalInterventionsState = atom<Intervention[]>({
	key: 'CausalInterventionsState',
	default: [],
})

export const CausalInferenceBaselineValuesState = atom<Map<string, number>>({
	key: 'CausalInferenceBaselineValuesState',
	default: new Map(),
})

export const CausalInferenceBaselineOffsetsState = atom<Map<string, number>>({
	key: 'CausalInferenceBaselineOffsetsState',
	default: new Map(),
})

export const CausalInferenceDifferenceFromBaselineValuesState = selector<
	Map<string, number>
>({
	key: 'CausalInferenceDifferenceFromBaselineValuesState',
	get({ get }) {
		const baselines = get(CausalInferenceBaselineValuesState)
		const inferredValues = get(CausalInferenceResultState)
		const differences = new Map<string, number>()
		Array.from(baselines.keys()).forEach(columnName => {
			const baseline = baselines.get(columnName)
			const inferredValue = inferredValues.get(columnName)
			if (baseline !== undefined && inferredValue !== undefined) {
				differences.set(columnName, inferredValue - baseline)
			}
		})
		return differences
	},
})

export const CausalInferenceResultState = atom<Map<string, number>>({
	key: 'CausalInferenceResultState',
	default: new Map(),
})
