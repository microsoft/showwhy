/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { selector } from 'recoil'

import type { RelationshipWithWeight } from '../../domain/Relationship.js'
import {
	correlationsInTable,
	filterBoringRelationships,
} from '../../utils/Correlation.js'
import { CorrelationThresholdState } from '../atoms/index.js'
import { DatasetState, ProcessedArqueroTableState } from './dataset.js'

// TODO: We just use a plain variable to store the precalculatedCorrelations rather than an atom
// due to performance issues encountered setting an atom when using a large number of causal-variables.
// There is likely a better way to do this.
export let precalculatedCorrelations: RelationshipWithWeight[] | null = null
export function setPrecalculatedCorrelations(
	correlations: RelationshipWithWeight[],
) {
	precalculatedCorrelations = correlations
}

export function unsetPrecalculatedCorrelations() {
	precalculatedCorrelations = null
}

export const AllCorrelationsState = selector<RelationshipWithWeight[]>({
	key: 'AllCorrelationsState',
	async get({ get }) {
		const dataTable = get(ProcessedArqueroTableState)
		if (dataTable === undefined || dataTable.numCols() === 0) {
			return []
		}

		if (precalculatedCorrelations) {
			return precalculatedCorrelations
		}

		const corrs = await correlationsInTable(dataTable, undefined, true)
		return corrs
	},
})

export const FilteredCorrelationsState = selector<RelationshipWithWeight[]>({
	key: 'FilteredCorrelationsState',
	get({ get }) {
		// TODO: We need to access correlationThreshold *before* the dataset to make sure it
		// rehydrates properly instead of reverting to the default.
		// This is similar to the issue in ActiveDatasetState, and seems fragile.
		// We should figure out a better way to handle persistence.
		const correlationThreshold = get(CorrelationThresholdState)
		const correlations = get(AllCorrelationsState)
		const dataset = get(DatasetState)
		return (
			filterBoringRelationships(
				dataset.variables,
				correlations,
			) as RelationshipWithWeight[]
		)
			.filter(
				correlation => Math.abs(correlation.weight) > correlationThreshold,
			)
			.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
	},
})
