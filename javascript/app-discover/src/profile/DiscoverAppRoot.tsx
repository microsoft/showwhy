/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RecoilBasedProfileHost , useHelpOnMount} from '@datashaper/app-framework'
import { memo, Suspense } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'

import { CauseDis } from '../components/CauseDis.js'
import { CauseDisErrorBoundary } from '../components/CauseDisErrorBoundary.js'
import {
	DeciParamsState,
	NotearsParamsState,
	PCParamsState,
} from '../state/atoms/algorithms_params.js'
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
} from '../state/index.js'
import type { DiscoverResource } from './DiscoverResource.js'

export const DiscoverAppRoot: React.FC<{
	resource: DiscoverResource
}> = memo(function DiscoverAppRoot({ resource }) {
	useHelpOnMount('discover')
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
})

const CauseDisHooks: React.FC = memo(function CauseDisHooks() {
	useRehydrateRecoil()
	useCausalGraphHistoryTracker()
	useCausalInferenceUpdater()
	return null
})

function loadState(resource: DiscoverResource, { set }: MutableSnapshot) {
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

	if (resource.ui.notearsParams) {
		set(NotearsParamsState, resource.ui.notearsParams)
	}

	if (resource.ui.deciParams) {
		set(DeciParamsState, resource.ui.deciParams)
	}

	if (resource.ui.pcParams) {
		set(PCParamsState, resource.ui.pcParams)
	}
}

function saveState(resource: DiscoverResource, { getLoadable }: Snapshot) {
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
	const notearsParams = getLoadable(NotearsParamsState).getValue()
	const deciParams = getLoadable(DeciParamsState).getValue()
	const pcParams = getLoadable(PCParamsState).getValue()
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
		notearsParams,
		deciParams,
		pcParams,
	}
}

function hashMap<V>(m: Map<string, V>): Record<string, V> {
	const result: Record<string, V> = {}
	m.forEach((v, k) => (result[k] = v))
	return result
}
