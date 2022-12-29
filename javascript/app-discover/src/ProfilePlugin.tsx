/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppServices, ProfilePlugin } from '@datashaper/app-framework'
import {
	CommandBarSection,
	RecoilBasedProfileHost,
} from '@datashaper/app-framework'
import type { ResourceSchema } from '@datashaper/schema'
import type { DataPackage } from '@datashaper/workflow'
import { Resource } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { memo, Suspense } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'

import { CauseDis } from './components/CauseDis.js'
import { CauseDisErrorBoundary } from './components/CauseDisErrorBoundary.js'
import { GraphViewStates } from './components/graph/GraphViews.types.js'
import type { DECIParams } from './domain/Algorithms/DECI.js'
import { CausalDiscoveryAlgorithm } from './domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from './domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryNormalization } from './domain/CausalDiscovery/CausalDiscoveryNormalization.js'
import type { CausalDiscoveryResult } from './domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EMPTY_CAUSAL_DISCOVERY_RESULT } from './domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { Intervention } from './domain/CausalInference.js'
import type { NodePosition } from './domain/NodePosition.js'
import { DeciParamsState } from './state/atoms/algorithms_params.js'
import {
	CausalDiscoveryNormalizationState,
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
	CausalInterventionsState,
	ConfidenceThresholdState,
	CorrelationThresholdState,
	DatasetNameState,
	FixedInterventionRangesEnabledState,
	GraphViewState,
	InModelColumnNamesState,
	NodePositionsState,
	SelectedCausalDiscoveryAlgorithmState,
	StraightEdgesState,
	useCausalGraphHistoryTracker,
	useCausalInferenceUpdater,
	useRehydrateRecoil,
	WeightThresholdState,
} from './state/index.js'

const DISCOVERY_PROFILE = 'showwhy-discover'

export class DiscoveryProfilePlugin
	implements ProfilePlugin<DiscoveryResource>
{
	public readonly profile = DISCOVERY_PROFILE
	public readonly title = 'Causal Discovery'
	public readonly iconName = 'SearchData'

	public renderer = DiscoverAppRoot
	private _dataPackage: DataPackage | undefined

	public initialize(_api: AppServices, dataPackage: DataPackage) {
		this._dataPackage = dataPackage
	}

	public createResource() {
		return new DiscoveryResource()
	}

	public getCommandBarCommands(
		section: CommandBarSection,
	): IContextualMenuItem[] | undefined {
		const dp = this._dataPackage
		if (dp == null) {
			throw new Error('Data package not initialized')
		}
		if (section === CommandBarSection.New) {
			return [
				{
					key: this.profile,
					text: `New ${this.title}`,
					onClick: () => {
						const resource = this.createResource?.()
						resource.name = dp.suggestResourceName(resource.name)
						dp.addResource(resource)
					},
				},
			]
		}
	}
}

interface DiscoveryResourceSchema extends ResourceSchema {
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

class DiscoveryResource extends Resource {
	public readonly $schema = ''
	public readonly profile = DISCOVERY_PROFILE

	public defaultName(): string {
		return 'Causal Discovery'
	}

	public datasetName = ''

	public causalGraph: {
		inModelColumnNames: string[]
		constraints: CausalDiscoveryConstraints
		results: CausalDiscoveryResult
	} = {
		inModelColumnNames: [],
		constraints: { causes: [], effects: [], manualRelationships: [] },
		results: EMPTY_CAUSAL_DISCOVERY_RESULT,
	}

	public causalInference: {
		interventions: Intervention[]
		baselineValues: Record<string, number>
		results: Record<string, number>
	} = {
		interventions: [],
		baselineValues: {},
		results: {},
	}

	public layout: {
		nodePositions: Record<string, NodePosition>
	} = { nodePositions: {} }

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
	} = {
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
	}

	public override toSchema(): DiscoveryResourceSchema {
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

	public override loadSchema(schema: DiscoveryResourceSchema) {
		super.loadSchema(schema)
		this.datasetName = schema.datasetName
		this.causalGraph = schema.causalGraph
		this.causalInference = schema.causalInference
		this.layout = schema.layout
		this.ui = schema.ui
	}
}

const DiscoverAppRoot: React.FC<{ resource: DiscoveryResource }> = memo(
	function DiscoverAppRoot({ resource }) {
		return (
			<RecoilBasedProfileHost
				resource={resource}
				loadState={loadState}
				saveState={saveState}
			>
				<CauseDisErrorBoundary>
					<Suspense fallback={null}>
						<CauseDisHooks />
					</Suspense>
					<CauseDis />
				</CauseDisErrorBoundary>
			</RecoilBasedProfileHost>
		)
	},
)

const CauseDisHooks: React.FC = memo(function CauseDisHooks() {
	useRehydrateRecoil()
	useCausalGraphHistoryTracker()
	useCausalInferenceUpdater()
	return null
})

function loadState(resource: DiscoveryResource, { set }: MutableSnapshot) {
	set(InModelColumnNamesState, resource.causalGraph.inModelColumnNames)
	set(CausalGraphConstraintsState, resource.causalGraph.constraints)
	set(CausalDiscoveryResultsState, resource.causalGraph.results)
	set(CausalInterventionsState, resource.causalInference.interventions)

	// these are treated as Maps in the code
	set(
		CausalInferenceBaselineValuesState,
		new Map(Object.entries(resource.causalInference.baselineValues)),
	)
	set(
		CausalInferenceResultState,
		new Map(Object.entries(resource.causalInference.results)),
	)
	set(DatasetNameState, resource.datasetName)
	set(NodePositionsState, resource.layout.nodePositions)
	set(StraightEdgesState, resource.ui.straightEdges)
	set(
		FixedInterventionRangesEnabledState,
		resource.ui.fixedInterventionRangesEnabled,
	)
	set(CausalDiscoveryNormalizationState, resource.ui.normalization)
	set(
		SelectedCausalDiscoveryAlgorithmState,
		resource.ui.selectedDiscoveryAlgorithm,
	)
	set(WeightThresholdState, resource.ui.weightThreshold)
	set(ConfidenceThresholdState, resource.ui.confidenceThreshold)
	set(CorrelationThresholdState, resource.ui.correlationThreshold)
	set(GraphViewState, resource.ui.view)

	if (resource.ui.deciParams) {
		set(DeciParamsState, resource.ui.deciParams)
	}
}

function saveState(resource: DiscoveryResource, { getLoadable }: Snapshot) {
	const inModelColumnNames = getLoadable(InModelColumnNamesState).getValue()
	const causalGraphConstraints = getLoadable(
		CausalGraphConstraintsState,
	).getValue()
	const causalDiscoveryResultsState = getLoadable(
		CausalDiscoveryResultsState,
	).getValue()
	const causalInterventions = getLoadable(CausalInterventionsState).getValue()
	const baselineValues = getLoadable(
		CausalInferenceBaselineValuesState,
	).getValue()
	const inferenceResults = getLoadable(CausalInferenceResultState).getValue()
	const datasetName = getLoadable(DatasetNameState).getValue()
	const nodePositions = getLoadable(NodePositionsState).getValue()
	const straightEdges = getLoadable(StraightEdgesState).getValue()
	const fixedInterventionRangesEnabled = getLoadable(
		FixedInterventionRangesEnabledState,
	).getValue()
	const normalization = getLoadable(
		CausalDiscoveryNormalizationState,
	).getValue()
	const deciParams = getLoadable(DeciParamsState).getValue()
	const selectedDiscoveryAlgorithm = getLoadable(
		SelectedCausalDiscoveryAlgorithmState,
	).getValue()
	const weightThreshold = getLoadable(WeightThresholdState).getValue()
	const confidenceThreshold = getLoadable(ConfidenceThresholdState).getValue()
	const correlationThreshold = getLoadable(CorrelationThresholdState).getValue()
	const view = getLoadable(GraphViewState).getValue()

	resource.causalGraph = {
		inModelColumnNames,
		constraints: causalGraphConstraints,
		results: causalDiscoveryResultsState,
	}
	resource.causalInference = {
		interventions: causalInterventions,
		baselineValues: hashMap(baselineValues),
		results: hashMap(inferenceResults),
	}
	resource.datasetName = datasetName
	resource.layout = { nodePositions }
	resource.ui = {
		straightEdges,
		fixedInterventionRangesEnabled,
		selectedDiscoveryAlgorithm,
		weightThreshold,
		confidenceThreshold,
		correlationThreshold,
		view,
		normalization,
		deciParams,
	}
}

function hashMap<V>(m: Map<string, V>): Record<string, V> {
	const result: Record<string, V> = {}
	m.forEach((v, k) => (result[k] = v))
	return result
}
