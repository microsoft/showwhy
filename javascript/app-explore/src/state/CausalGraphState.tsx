/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo } from 'react'
import {
	atom,
	DefaultValue,
	selector,
	selectorFamily,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import { recoilPersist } from 'recoil-persist'

import { discover as runCausalDiscovery } from '../domain/CausalDiscovery/CausalDiscovery.js'
import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryResult } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalVariable } from '../domain/CausalVariable.js'
import { variablesForColumnNames } from '../domain/Dataset.js'
import type { CausalGraph } from '../domain/Graph.js'
import type { GraphDifferences } from '../domain/GraphDifferences.js'
import { findDifferencesBetweenGraphs } from '../domain/GraphDifferences.js'
import type { RelationshipReference } from '../domain/Relationship.js'
import { persistAtomEffect } from '../state/PersistentInfoState.js'
import { DatasetState, DEFAULT_DATASET_NAME } from './DatasetState.js'
import {
	ConfidenceThresholdState,
	LoadingState,
	PauseAutoRunState,
	SelectedCausalDiscoveryAlgorithmState,
	WeightThresholdState,
} from './UIState.js'

const { persistAtom } = recoilPersist()

export const InModelColumnNamesState = atom<string[]>({
	key: 'InModelColumnNamesState',
	default: [],
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const InModelCausalVariablesState = selector<CausalVariable[]>({
	key: 'InModelCausalVariablesState',
	get({ get }) {
		const inModelColumnNames = get(InModelColumnNamesState)
		const dataset = get(DatasetState)
		return variablesForColumnNames(dataset, inModelColumnNames) // inModelColumnNames.filter(columnName => dataset.variables.has(columnName));
	},
	set({ set }, newValue) {
		const columnNames =
			newValue instanceof DefaultValue
				? newValue
				: newValue.map(variable => variable.columnName)
		set(InModelColumnNamesState, columnNames)
	},
})

export const isVariableInModel = selectorFamily<boolean, string>({
	key: 'IsVariableInModel',
	get:
		(variableColumnName: string) =>
		({ get }) =>
			get(InModelColumnNamesState).includes(variableColumnName),
})

export const CausalGraphConstraintsState = atom<CausalDiscoveryConstraints>({
	key: 'CausalGraphConstraintsState',
	default: {
		causes: [],
		effects: [],
		forbiddenRelationships: [],
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

export const CausalDiscoveryResultsState = atom<CausalDiscoveryResult>({
	key: 'CausalDiscoveryResultsState',
	default: EMPTY_CAUSAL_DISCOVERY_RESULT,
})

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

export const CausalGraphState = selector<CausalGraph>({
	key: 'CausalGraphState',
	get({ get }) {
		const results = get(CausalDiscoveryResultsState)
		return results.graph
	},
})

export const PreviousCausalGraphState = selector<CausalGraph | undefined>({
	key: 'PreviousCausalGraphState',
	get({ get }) {
		const graphHistory = get(CausalGraphHistoryState)
		return graphHistory.length >= 2
			? graphHistory[graphHistory.length - 2]
			: undefined
	},
})

export const CausalGraphChangesState = selector<GraphDifferences | undefined>({
	key: 'CausalGraphChangesState',
	get({ get }) {
		const weightThreshold = get(WeightThresholdState)
		const confidenceThreshold = get(ConfidenceThresholdState)
		const currentCausalGraph = get(CausalGraphState)
		const previousCausalGraph = get(PreviousCausalGraphState)
		if (previousCausalGraph === undefined) {
			return
		}

		const difference = findDifferencesBetweenGraphs(
			previousCausalGraph,
			currentCausalGraph,
			weightThreshold,
			confidenceThreshold,
		)
		return difference
	},
})
