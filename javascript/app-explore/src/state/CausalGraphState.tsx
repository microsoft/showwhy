/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, DefaultValue, selector, selectorFamily } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryResult } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalVariable } from '../domain/CausalVariable.js'
import { variablesForColumnNames } from '../domain/Dataset.js'
import type { CausalGraph } from '../domain/Graph.js'
import type { GraphDifferences } from '../domain/GraphDifferences.js'
import { findDifferencesBetweenGraphs } from '../domain/GraphDifferences.js'
import { persistAtomEffect } from '../state/PersistentInfoState.js'
import { DatasetState } from './DatasetState.js'
import { ConfidenceThresholdState, WeightThresholdState } from './UIState.js'

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

export const CausalDiscoveryResultsState = atom<CausalDiscoveryResult>({
	key: 'CausalDiscoveryResultsState',
	default: EMPTY_CAUSAL_DISCOVERY_RESULT,
})

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
