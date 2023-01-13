/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resource } from '@datashaper/workflow'

import { GraphViewStates } from '../components/graph/GraphViews.types.js'
import type { DECIParams } from '../domain/Algorithms/DECI.js'
import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryNormalization } from '../domain/CausalDiscovery/CausalDiscoveryNormalization.js'
import type { CausalDiscoveryResult } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { Intervention } from '../domain/CausalInference.js'
import type { NodePosition } from '../domain/NodePosition.js'
import { DISCOVERY_PROFILE } from './constants.js'
import type { DiscoverResourceSchema } from './DiscoverResourceSchema.js'

export class DiscoverResource extends Resource {
	public readonly $schema = ''
	public readonly profile = DISCOVERY_PROFILE

	public constructor(schema?: DiscoverResourceSchema) {
		super()
		this.loadSchema(schema)
	}

	public defaultTitle(): string {
		return 'Causal Discovery'
	}

	public datasetName = ''

	public causalGraph: {
		inModelColumnNames: string[]
		constraints: CausalDiscoveryConstraints
		results: CausalDiscoveryResult
	} = emptyCausalGraph()

	public causalInference: {
		interventions: Intervention[]
		baselineValues: Record<string, number>
		results: Record<string, number>
	} = emptyCausalInference()

	public layout: {
		nodePositions: Record<string, NodePosition>
	} = emptyLayout()

	public ui: {
		straightEdges: boolean
		fixedInterventionRangesEnabled: boolean
		selectedDiscoveryAlgorithm: CausalDiscoveryAlgorithm
		weightThreshold: number
		confidenceThreshold: number
		correlationThreshold: number
		view: GraphViewStates
		normalization: CausalDiscoveryNormalization
		deciParams: DECIParams
	} = emptyUi()

	public override toSchema(): DiscoverResourceSchema {
		return {
			...super.toSchema(),
			profile: this.profile,
			datasetName: this.datasetName,
			causalGraph: this.causalGraph,
			causalInference: this.causalInference,
			layout: this.layout,
			ui: this.ui,
		}
	}

	public override loadSchema(schema: DiscoverResourceSchema | undefined) {
		super.loadSchema(schema)
		this.name = schema?.name ?? this.defaultName()
		this.datasetName = schema?.datasetName ?? this.defaultName()
		this.causalGraph = schema?.causalGraph ?? emptyCausalGraph()
		this.causalInference = schema?.causalInference ?? emptyCausalInference()
		this.layout = schema?.layout ?? emptyLayout()
		this.ui = schema?.ui ?? emptyUi()
	}
}
const emptyCausalGraph = () => ({
	inModelColumnNames: [],
	constraints: { causes: [], effects: [], manualRelationships: [] },
	results: EMPTY_CAUSAL_DISCOVERY_RESULT,
})

const emptyCausalInference = () => ({
	interventions: [],
	baselineValues: {},
	results: {},
})

const emptyLayout = () => ({ nodePositions: {} })

const emptyUi = () => ({
	straightEdges: false,
	fixedInterventionRangesEnabled: false,
	selectedDiscoveryAlgorithm: CausalDiscoveryAlgorithm.NOTEARS,
	weightThreshold: 0.005,
	confidenceThreshold: 0.5,
	correlationThreshold: 0.2,
	view: GraphViewStates.CausalView,
	normalization: {
		withMeanEnabled: true,
		withStdEnabled: true,
	},
	deciParams: { model_options: {}, ate_options: {} },
})
