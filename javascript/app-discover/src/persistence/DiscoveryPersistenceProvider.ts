/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppResourceHandler, useDataPackage } from '@showwhy/app-common'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import type { GraphViewStates } from '../components/graph/GraphViews.types.js'
import type { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalDiscoveryResult } from '../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { Intervention } from '../domain/CausalInference.js'
import type { NodePosition } from '../domain/NodePosition.js'
import {
	AutoLayoutEnabledState,
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
	CausalInferenceBaselineOffsetsState,
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
	CausalInterventionsState,
	ConfidenceThresholdState,
	CorrelationThresholdState,
	DatasetNameState,
	GraphViewState,
	InModelColumnNamesState,
	NodePositionsState,
	SelectedCausalDiscoveryAlgorithmState,
	StraightEdgesState,
	WeightThresholdState,
} from '../state/index.js'

interface ProjectJson {
	causalGraph: {
		inModelColumnNames: string[]
		constraints: CausalDiscoveryConstraints
		results: CausalDiscoveryResult
	}
	causalInference: {
		interventions: Intervention[]
		baselineValues: Map<string, number>
		baselineOffsets: Map<string, number>
		results: Map<string, number>
	}
	dataset: {
		datasetName: string
	}
	layout: {
		nodePositions: { [key: string]: NodePosition }
	}
	ui: {
		straightEdges: boolean
		autoLayoutEnabled: boolean
		selectedDiscoveryAlgorithm: CausalDiscoveryAlgorithm
		weightThreshold: number
		confidenceThreshold: number
		correlationThreshold: number
		view: GraphViewStates
	}
}

export const DiscoveryPersistenceProvider: React.FC = memo(
	function EventsPersistenceProvider() {
		const dp = useDataPackage()
		const getProjectJson = useGetProjectJson()
		const loadProjectJson = useLoadProjectJson()

		const persistable = useMemo(
			() =>
				new AppResourceHandler<ProjectJson>(
					'discover',
					'discover',
					getProjectJson,
					loadProjectJson,
				),
			[getProjectJson, loadProjectJson],
		)

		useEffect(() => {
			dp.addResourceHandler(persistable)
		}, [dp, persistable])

		// renderless component
		return null
	},
)

function useGetProjectJson(): () => ProjectJson {
	const inModelColumnNames = useRecoilValue(InModelColumnNamesState)
	const causalGraphConstraints = useRecoilValue(CausalGraphConstraintsState)
	const causalDiscoveryResultsState = useRecoilValue(
		CausalDiscoveryResultsState,
	)
	const causalInterventions = useRecoilValue(CausalInterventionsState)
	const baselineValues = useRecoilValue(CausalInferenceBaselineValuesState)
	const baselineOffsets = useRecoilValue(CausalInferenceBaselineOffsetsState)
	const inferenceResults = useRecoilValue(CausalInferenceResultState)
	const datasetName = useRecoilValue(DatasetNameState)
	const nodePositions = useRecoilValue(NodePositionsState)
	const straightEdges = useRecoilValue(StraightEdgesState)
	const autoLayoutEnabled = useRecoilValue(AutoLayoutEnabledState)
	const selectedDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const correlationThreshold = useRecoilValue(CorrelationThresholdState)
	const view = useRecoilValue(GraphViewState)

	return useCallback(
		() => ({
			causalGraph: {
				inModelColumnNames,
				constraints: causalGraphConstraints,
				results: causalDiscoveryResultsState,
			},
			causalInference: {
				interventions: causalInterventions,
				baselineValues,
				baselineOffsets,
				results: inferenceResults,
			},
			dataset: {
				datasetName,
			},
			layout: { nodePositions },
			ui: {
				straightEdges,
				autoLayoutEnabled,
				selectedDiscoveryAlgorithm,
				weightThreshold,
				confidenceThreshold,
				correlationThreshold,
				view,
			},
		}),
		[
			inModelColumnNames,
			causalGraphConstraints,
			causalDiscoveryResultsState,
			causalInterventions,
			baselineValues,
			baselineOffsets,
			inferenceResults,
			datasetName,
			nodePositions,
			straightEdges,
			autoLayoutEnabled,
			selectedDiscoveryAlgorithm,
			weightThreshold,
			confidenceThreshold,
			correlationThreshold,
			view,
		],
	)
}

function useLoadProjectJson(): (json: ProjectJson) => void {
	const setInModelColumnNames = useSetRecoilState(InModelColumnNamesState)
	const setCausalGraphConstraints = useSetRecoilState(
		CausalGraphConstraintsState,
	)
	const setCausalDiscoveryResultsState = useSetRecoilState(
		CausalDiscoveryResultsState,
	)
	const setCausalInterventions = useSetRecoilState(CausalInterventionsState)
	const setBaselineValues = useSetRecoilState(
		CausalInferenceBaselineValuesState,
	)
	const setBaselineOffsets = useSetRecoilState(
		CausalInferenceBaselineOffsetsState,
	)
	const setInferenceResults = useSetRecoilState(CausalInferenceResultState)
	const setDatasetName = useSetRecoilState(DatasetNameState)
	const setNodePositions = useSetRecoilState(NodePositionsState)
	const setStraightEdges = useSetRecoilState(StraightEdgesState)
	const setAutoLayoutEnabled = useSetRecoilState(AutoLayoutEnabledState)
	const setSelectedDiscoveryAlgorithm = useSetRecoilState(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const setWeightThreshold = useSetRecoilState(WeightThresholdState)
	const setConfidenceThreshold = useSetRecoilState(ConfidenceThresholdState)
	const setCorrelationThreshold = useSetRecoilState(CorrelationThresholdState)
	const setView = useSetRecoilState(GraphViewState)

	return useCallback(
		(json: ProjectJson) => {
			setInModelColumnNames(json.causalGraph.inModelColumnNames)
			setCausalGraphConstraints(json.causalGraph.constraints)
			setCausalDiscoveryResultsState(json.causalGraph.results)
			setCausalInterventions(json.causalInference.interventions)

			// these are treated as Maps in the code
			setBaselineValues(
				new Map(Object.entries(json.causalInference.baselineValues)),
			)
			setBaselineOffsets(
				new Map(Object.entries(json.causalInference.baselineOffsets)),
			)
			setInferenceResults(new Map(Object.entries(json.causalInference.results)))

			setDatasetName(json.dataset.datasetName)
			setNodePositions(json.layout.nodePositions)
			setStraightEdges(json.ui.straightEdges)
			setAutoLayoutEnabled(json.ui.autoLayoutEnabled)
			setSelectedDiscoveryAlgorithm(json.ui.selectedDiscoveryAlgorithm)
			setWeightThreshold(json.ui.weightThreshold)
			setConfidenceThreshold(json.ui.confidenceThreshold)
			setCorrelationThreshold(json.ui.correlationThreshold)
			setView(json.ui.view)
		},
		[
			setInModelColumnNames,
			setCausalGraphConstraints,
			setCausalDiscoveryResultsState,
			setCausalInterventions,
			setBaselineValues,
			setBaselineOffsets,
			setInferenceResults,
			setDatasetName,
			setNodePositions,
			setStraightEdges,
			setAutoLayoutEnabled,
			setSelectedDiscoveryAlgorithm,
			setWeightThreshold,
			setConfidenceThreshold,
			setCorrelationThreshold,
			setView,
		],
	)
}
