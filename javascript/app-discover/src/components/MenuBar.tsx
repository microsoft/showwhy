/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { memo, useCallback, useEffect, useMemo } from 'react'
import {
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { useFilePicker } from 'use-file-picker'

import type { DatasetDatapackage } from '../domain/Dataset.js'
import { useDatasetLoader } from '../domain/Dataset.js'
import * as Graph from '../domain/Graph.js'
import { DeciParamsState } from '../state/atoms/algorithms_params.js'
import { useDownloadEdges } from '../state/hooks/useCausalEdgesReport.js'
import {
	CausalGraphConstraintsState,
	ConfidenceThresholdState,
	GraphViewState,
	InModelColumnNamesState,
	LoadingState,
	NodePositionsState,
	PanelsHiddenState,
	PersistedInfoState,
	StraightEdgesState,
	useCausalGraph,
	WeightThresholdState,
} from '../state/index.js'
import { saveObjectJSON } from '../utils/Save.js'
import {
	useAutoLayoutButtonMenuItem,
	useDatasetMenuItems,
	useDatasetStatisticsMenuItem,
	useModelMenuItems,
	useRunButtonMenuItem,
	useViewMenuItems,
} from './MenuBar.hooks.js'
import { useCommandBarStyles } from './MenuBar.styles.js'

export const MenuBar: React.FC = memo(function MenuBar() {
	const [selectedViewKey, setSelectedViewKey] = useRecoilState(GraphViewState)
	const [hidePanels, setHidePanels] = useRecoilState(PanelsHiddenState)
	const loadColumnTable = useDatasetLoader()
	const resetVariables = useResetRecoilState(InModelColumnNamesState)
	const resetConstraints = useResetRecoilState(CausalGraphConstraintsState)
	const resetParams = useResetRecoilState(DeciParamsState)
	const resetNodePositions = useResetRecoilState(NodePositionsState)
	const [useStraightEdges, setUseStraightEdges] =
		useRecoilState(StraightEdgesState)
	const causalGraph = useCausalGraph()

	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const causalRelationships = Graph.relationshipsAboveThresholds(
		causalGraph,
		weightThreshold,
		confidenceThreshold,
	)

	const setLoadingState = useSetRecoilState(LoadingState)
	const [persistedInfo, setPersistedInfo] = useRecoilState(PersistedInfoState)
	const [
		openCausalModelFileSelector,
		{ filesContent: causalModelFileContent },
	] = useFilePicker({
		accept: '.json',
	})
	const clearModel = useCallback(() => {
		resetVariables()
		resetConstraints()
		resetParams()
		resetNodePositions()
	}, [resetVariables, resetConstraints, resetParams, resetNodePositions])

	useEffect(() => {
		if (causalModelFileContent[0] !== undefined) {
			const content: DatasetDatapackage = JSON.parse(
				causalModelFileContent[0].content,
			) as DatasetDatapackage
			setPersistedInfo(content)
		}
	}, [causalModelFileContent, setPersistedInfo])

	const saveModel = useCallback(() => {
		saveObjectJSON('causal-model', persistedInfo, undefined)
	}, [persistedInfo])

	const loadTable = useCallback(
		(name: string) => {
			loadColumnTable(name)
			setLoadingState(undefined)
		},
		[loadColumnTable, setLoadingState],
	)
	console.log(causalRelationships)
	const exportEdges = useDownloadEdges(causalRelationships)
	const datasetMenuItems = useDatasetMenuItems(loadTable)
	const modelMenuItems = useModelMenuItems(
		saveModel,
		openCausalModelFileSelector,
		clearModel,
		exportEdges,
		!!causalRelationships.length,
	)
	const viewMenuItems = useViewMenuItems(
		selectedViewKey,
		setSelectedViewKey,
		useStraightEdges,
		setUseStraightEdges,
		hidePanels,
		setHidePanels,
	)

	const autoLayoutButtonMenuItem = useAutoLayoutButtonMenuItem()
	const runButtonMenuItem = useRunButtonMenuItem()
	const datasetStatisticsMenuItem = useDatasetStatisticsMenuItem()

	const menuItems = useMemo<ICommandBarItemProps[]>(
		() => [datasetMenuItems, modelMenuItems, viewMenuItems],
		[datasetMenuItems, modelMenuItems, viewMenuItems],
	)
	const interactiveItems = useMemo(
		() => [
			datasetStatisticsMenuItem,
			autoLayoutButtonMenuItem,
			runButtonMenuItem,
		],
		[datasetStatisticsMenuItem, autoLayoutButtonMenuItem, runButtonMenuItem],
	)
	const commandBarStyles = useCommandBarStyles()
	return (
		<CommandBar
			items={menuItems}
			farItems={interactiveItems}
			styles={commandBarStyles}
		/>
	)
})
