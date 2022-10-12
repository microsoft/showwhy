/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { discover as runCausalDiscovery } from '../domain/CausalDiscovery/CausalDiscovery.js'
import { runCausalInference } from '../domain/CausalInference.js'
import type { RelationshipReference } from '../domain/Relationship.js'
import {
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
	CausalGraphHistoryState,
	CausalGraphState,
	InModelCausalVariablesState,
	InModelColumnNamesState,
} from './CausalGraphState.js'
import {
	CausalInferenceBaselineOffsetsState,
	CausalInferenceBaselineValuesState,
	CausalInferenceModelState,
	CausalInferenceResultState,
	CausalInterventionsState,
} from './CausalInferenceState.js'
import { DatasetState, DEFAULT_DATASET_NAME } from './DatasetState.js'
import {
	ConfidenceThresholdState,
	CorrelationThresholdState,
	LoadingState,
	PauseAutoRunState,
	SelectedCausalDiscoveryAlgorithmState,
	WeightThresholdState,
} from './UIState.js'

/**
 * This component just performs an initial access of persisted state atoms to
 * make sure they have been rehydrated before being accessed for the
 * first time. Otherwise we would sometimes see issues where default values
 * were applied *after* rehydration.
 */
export function useRehydrateRecoil() {
	useRecoilValue(InModelColumnNamesState)
	useRecoilValue(CausalGraphConstraintsState)
	useRecoilValue(WeightThresholdState)
	useRecoilValue(CorrelationThresholdState)
}

/**
 * Hook to update initial causal inference results after causal discovery is run
 */
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

export function useCausalDiscoveryRunner() {
	const dataset = useRecoilValue(DatasetState)
	const inModelCausalVariables = useRecoilValue(InModelCausalVariablesState)
	const userConstraints = useRecoilValue(CausalGraphConstraintsState)
	const causalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const pauseAutoRun = useRecoilValue(PauseAutoRunState)
	const algorithm = useMemo(
		() => pauseAutoRun ?? causalDiscoveryAlgorithm,
		[pauseAutoRun, causalDiscoveryAlgorithm],
	)

	const setCausalDiscoveryResultsState = useSetRecoilState(
		CausalDiscoveryResultsState,
	)
	const setLoadingState = useSetRecoilState(LoadingState)

	const derivedConstraints: RelationshipReference[] = []
	inModelCausalVariables.forEach(sourceVar => {
		sourceVar.derivedFrom?.forEach(sourceColumn => {
			inModelCausalVariables.forEach(targetVar => {
				if (
					sourceVar !== targetVar &&
					(targetVar.derivedFrom?.includes(sourceColumn) ||
						sourceVar.disallowedRelationships?.includes(targetVar.columnName))
				) {
					derivedConstraints.push({
						source: sourceVar,
						target: targetVar,
					})
				}
			})
		})
	})

	const causalDiscoveryConstraints = {
		...userConstraints,
		forbiddenRelationships: [
			...userConstraints.forbiddenRelationships,
			...derivedConstraints,
		],
	}

	useEffect(() => {
		if (
			inModelCausalVariables.length < 2 ||
			dataset.name === DEFAULT_DATASET_NAME
		) {
			setCausalDiscoveryResultsState({
				graph: {
					variables: inModelCausalVariables,
					relationships: [],
					constraints: causalDiscoveryConstraints,
					algorithm,
				},
				causalInferenceModel: null,
			})
		}

		setLoadingState('Running causal discovery...')
		const runDiscovery = async () => {
			const results = await runCausalDiscovery(
				dataset,
				inModelCausalVariables,
				causalDiscoveryConstraints,
				algorithm,
			)
			setCausalDiscoveryResultsState(results)
			setLoadingState(undefined)
		}

		void runDiscovery()
	}, [dataset, inModelCausalVariables, userConstraints, algorithm])
}

// Component to track causal graph history using the pattern outlined here:
// https://github.com/facebookexperimental/Recoil/issues/485#issuecomment-660519295
export function useCausalGraphHistoryTracker() {
	const currentCausalGraph = useRecoilValue(CausalGraphState)
	const [causalGraphHistory, setCausalGraphHistory] = useRecoilState(
		CausalGraphHistoryState,
	)
	useEffect(
		() => setCausalGraphHistory([...causalGraphHistory, currentCausalGraph]),
		// this causes infinite render if we have complete deps
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[currentCausalGraph],
	)
}
