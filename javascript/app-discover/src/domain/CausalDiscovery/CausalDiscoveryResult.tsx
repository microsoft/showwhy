/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchDiscoverMetadata } from '../../api/types.js'
import type { CausalGraph } from '../../domain/Graph.js'
import type { CancelablePromise } from '../../utils/CancelablePromise.js'
import type { VariableNature } from '../VariableNature.js'
import { CausalDiscoveryAlgorithm } from './CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryResultEdge } from './CausalDiscoveryResultEdge.js'
import type { CausalDiscoveryResultNode } from './CausalDiscoveryResultNode.js'

/**
 * Causal Discovery results are sent in cytoscape JSON format.
 */

export const EMPTY_CAUSAL_DISCOVERY_RESULT = {
	graph: {
		variables: [],
		relationships: [],
		constraints: {
			causes: [],
			effects: [],
			manualRelationships: [],
		},
		algorithm: CausalDiscoveryAlgorithm.None,
	},
}

export interface CausalDiscoveryRequestReturnValue {
	elements: {
		edges: CausalDiscoveryResultEdge[]
		nodes: CausalDiscoveryResultNode[]
	}
	is_dag?: boolean
	has_confidence_values?: boolean
	intervention_model_id?: string
	ate_details_by_name?: ATEDetailsByName
}

export interface ATEDetails {
	reference: number | string
	intervention: number | string
	nature: VariableNature
}

export type ATEDetailsByName = Record<string, ATEDetails>

export interface NormalizedColumnMetadata {
	upper: number
	lower: number
	mean: number
	std: number
}

export type NormalizedColumnsMetadataByName = Record<
	string,
	NormalizedColumnMetadata
>

export interface DatasetStatistics {
	numberOfRows: number
	numberOfDroppedRows: number
}

export interface CausalDiscoveryResult {
	graph: CausalGraph
	taskId?: string
	// TODO: verify possibility to merge this with CausalVariable
	// binary && continuous only
	normalizedColumnsMetadata?: NormalizedColumnsMetadataByName
	datasetStatistics?: DatasetStatistics
}

export type CausalDiscoveryResultPromise = CancelablePromise<
	FetchDiscoverMetadata,
	CausalDiscoveryResult
>
