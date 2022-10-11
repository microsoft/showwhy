/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

import type {
	CausalInferenceModel,
	Intervention,
} from '../domain/CausalInference.js'
import { runCausalInference } from '../domain/CausalInference.js'
import {
	CausalDiscoveryResultsState,
	InModelCausalVariablesState,
} from './CausalGraphState.js'
import { ConfidenceThresholdState, WeightThresholdState } from './UIState.js'

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

// Component to update initial causal inference results after causal discovery is run
export function useCausalInferenceUpdater() {
	const inModelVariables = useRecoilValue(InModelCausalVariablesState)
	const inferenceModel = useRecoilValue(CausalInferenceModelState)
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const setInitialValues = useSetRecoilState(CausalInferenceBaselineValuesState)

	const initialValueOffsets = useRecoilValue(
		CausalInferenceBaselineOffsetsState,
	)
	const interventions = useRecoilValue(CausalInterventionsState)
	const setCausalInferenceResults = useSetRecoilState(
		CausalInferenceResultState,
	)

	useEffect(() => {
		if (inferenceModel) {
			const runInference = async () => {
				const baselineResults = await runCausalInference(
					inferenceModel,
					confidenceThreshold,
					weightThreshold,
					inModelVariables,
				)
				setInitialValues(baselineResults)
				const intervenedResults = await runCausalInference(
					inferenceModel,
					confidenceThreshold,
					weightThreshold,
					inModelVariables,
					initialValueOffsets,
					interventions,
				)
				setCausalInferenceResults(intervenedResults)
			}

			void runInference()
		}
	}, [
		inferenceModel,
		confidenceThreshold,
		weightThreshold,
		inModelVariables,
		interventions,
		initialValueOffsets,
		setCausalInferenceResults,
		setInitialValues,
	])
}

export function useCausalInterventions(): Intervention[] {
	return useRecoilValue(CausalInterventionsState)
}

export function useSetCausalInterventions(): (
	interventions: Intervention[],
) => void {
	return useSetRecoilState(CausalInterventionsState)
}
