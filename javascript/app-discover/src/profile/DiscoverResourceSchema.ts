/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

import type { GraphViewStates } from '../components/graph/GraphViews.types.js'
import type { DECIParams } from '../domain/Algorithms/DECI.js'
import type { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryNormalization } from '../domain/CausalDiscovery/CausalDiscoveryNormalization.js'
import type { CausalDiscoveryResult } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { Intervention } from '../domain/CausalInference.js'
import type { NodePosition } from '../domain/NodePosition.js'
import type { DISCOVERY_PROFILE } from './constants.js'

export interface DiscoverResourceSchema extends ResourceSchema {
	profile: typeof DISCOVERY_PROFILE
	datasetName: string
	causalGraph: {
		inModelColumnNames: string[]
		constraints: CausalDiscoveryConstraints
		results: CausalDiscoveryResult
	}
	causalInference: {
		interventions: Intervention[]
		baselineValues: Record<string, number>
		results: Record<string, number>
	}
	layout: {
		nodePositions: Record<string, NodePosition>
	}
	ui: {
		straightEdges: boolean
		fixedInterventionRangesEnabled: boolean
		selectedDiscoveryAlgorithm: CausalDiscoveryAlgorithm
		weightThreshold: number
		confidenceThreshold: number
		correlationThreshold: number
		view: GraphViewStates
		normalization: CausalDiscoveryNormalization
		deciParams: DECIParams
	}
}
