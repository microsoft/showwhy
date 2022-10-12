/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultValue, selector, selectorFamily } from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.js'
import { variablesForColumnNames } from '../../domain/Dataset.js'
import type { CausalGraph } from '../../domain/Graph.js'
import type { GraphDifferences } from '../../domain/GraphDifferences.js'
import { findDifferencesBetweenGraphs } from '../../domain/GraphDifferences.js'
import {
	CausalDiscoveryResultsState,
	CausalGraphHistoryState,
	ConfidenceThresholdState,
	InModelColumnNamesState,
	WeightThresholdState,
} from '../atoms/index.js'
import { DatasetState } from './dataset.js'

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
		const currentCausalGraph = get(CausalDiscoveryResultsState)
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
