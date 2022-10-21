/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalInferenceModel } from '../../domain/CausalInference.js'
import type { CausalGraph } from '../../domain/Graph.js'
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
			forbiddenRelationships: [],
		},
		algorithm: CausalDiscoveryAlgorithm.None,
	},
	causalInferenceModel: null,
}

export interface CausalDiscoveryRequestReturnValue {
	elements: {
		edges: CausalDiscoveryResultEdge[]
		nodes: CausalDiscoveryResultNode[]
	}
}

export interface CausalDiscoveryResult {
	graph: CausalGraph
	causalInferenceModel: CausalInferenceModel | null
	taskId?: string
}
