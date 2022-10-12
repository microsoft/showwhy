/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { useFilePicker } from 'use-file-picker'

import type { DatasetDatapackage } from '../domain/Dataset.js'
import useDatasetLoader from '../domain/Dataset.js'
import {
	AutoLayoutEnabledState,
	CausalGraphConstraintsState,
	ConfidenceThresholdState,
	CorrelationThresholdState,
	GraphViewState,
	InModelColumnNamesState,
	LoadingState,
	PersistedInfoState,
	ShowChangesInGraphState,
	StraightEdgesState,
	WeightThresholdState,
} from '../state/index.js'
import { saveObjectJSON } from '../utils/Save.js'
import { command_bar_styles } from './MenuBar.constants.js'
import {
	useAutoLayoutSliderMenuItem,
	useDatasetMenuItems,
	useModelMenuItems,
	useSliderMenuItem,
	useTogglePauseButtonMenuItem,
	useViewMenuItems,
} from './MenuBar.hooks.js'

export const MenuBar: React.FC = memo(function MenuBar() {
	const [selectedViewKey, setSelectedViewKey] = useRecoilState(GraphViewState)
	const { loadColumnTable } = useDatasetLoader()
	const resetVariables = useResetRecoilState(InModelColumnNamesState)
	const resetConstraints = useResetRecoilState(CausalGraphConstraintsState)
	const [useStraightEdges, setUseStraightEdges] =
		useRecoilState(StraightEdgesState)
	const [autoLayoutEnabled, setAutoLayoutEnabled] = useRecoilState(
		AutoLayoutEnabledState,
	)
	const [showChangesInGraph, setShowChangesInGraph] = useRecoilState(
		ShowChangesInGraphState,
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
	}, [resetVariables, resetConstraints])

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
		(name: string, table: ColumnTable) => {
			setLoadingState('Loading ' + name)
			setTimeout(() => {
				loadColumnTable(name, table)
				setLoadingState(undefined)
			}, 500)
		},
		[loadColumnTable, setLoadingState],
	)

	const datasetMenuItems = useDatasetMenuItems(loadTable)
	const modelMenuItems = useModelMenuItems(
		saveModel,
		openCausalModelFileSelector,
		clearModel,
	)
	const viewMenuItems = useViewMenuItems(
		selectedViewKey,
		setSelectedViewKey,
		useStraightEdges,
		setUseStraightEdges,
		autoLayoutEnabled,
		setAutoLayoutEnabled,
		showChangesInGraph,
		setShowChangesInGraph,
	)
	const edgeWeightSliderMenuItem = useSliderMenuItem(
		'Edge Weight Threshold',
		WeightThresholdState,
	)
	const edgeConfidenceSliderMenuItem = useSliderMenuItem(
		'Edge ConfidenceThreshold',
		ConfidenceThresholdState,
	)
	const correlationSliderMenuItem = useSliderMenuItem(
		'Correlation Visibility Threshold',
		CorrelationThresholdState,
	)
	const autoLayoutSliderMenuItem = useAutoLayoutSliderMenuItem()
	const togglePauseButtonMenuItem = useTogglePauseButtonMenuItem()

	const menuItems = useMemo<ICommandBarItemProps[]>(
		() => [datasetMenuItems, modelMenuItems, viewMenuItems],
		[datasetMenuItems, modelMenuItems, viewMenuItems],
	)
	const interactiveItems = useMemo(
		() => [
			togglePauseButtonMenuItem,
			autoLayoutSliderMenuItem,
			edgeWeightSliderMenuItem,
			edgeConfidenceSliderMenuItem,
			correlationSliderMenuItem,
		],
		[
			togglePauseButtonMenuItem,
			autoLayoutSliderMenuItem,
			edgeWeightSliderMenuItem,
			edgeConfidenceSliderMenuItem,
			correlationSliderMenuItem,
		],
	)
	return (
		<CommandBar
			items={menuItems}
			farItems={interactiveItems}
			styles={command_bar_styles}
		/>
	)
})
