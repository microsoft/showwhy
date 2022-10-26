/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { useFilePicker } from 'use-file-picker'

import type { DatasetDatapackage } from '../domain/Dataset.js'
import { useDatasetLoader } from '../domain/Dataset.js'
import { DeciParamsState } from '../state/atoms/algorithms_params.js'
import {
	AutoLayoutEnabledState,
	CausalGraphConstraintsState,
	ConfidenceThresholdState,
	CorrelationThresholdState,
	GraphViewState,
	InModelColumnNamesState,
	LoadingState,
	PersistedInfoState,
	StraightEdgesState,
	WeightThresholdState,
} from '../state/index.js'
import { saveObjectJSON } from '../utils/Save.js'
import {
	useAutoLayoutToggleMenuItem,
	useDatasetMenuItems,
	useFixedInterventionRangesToggleMenuItem,
	useModelMenuItems,
	useRunButtonMenuItem,
	useSliderMenuItem,
	useViewMenuItems,
} from './MenuBar.hooks.js'
import { useCommandBarStyles } from './MenuBar.styles.js'

export const MenuBar: React.FC = memo(function MenuBar() {
	const [selectedViewKey, setSelectedViewKey] = useRecoilState(GraphViewState)
	const loadColumnTable = useDatasetLoader()
	const resetVariables = useResetRecoilState(InModelColumnNamesState)
	const resetConstraints = useResetRecoilState(CausalGraphConstraintsState)
	const resetParams = useResetRecoilState(DeciParamsState)
	const [useStraightEdges, setUseStraightEdges] =
		useRecoilState(StraightEdgesState)
	const [autoLayoutEnabled, setAutoLayoutEnabled] = useRecoilState(
		AutoLayoutEnabledState,
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
	}, [resetVariables, resetConstraints, resetParams])

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
	)

	const edgeWeightSliderMenuItem = useSliderMenuItem(
		'Edge weight threshold',
		WeightThresholdState,
	)
	const edgeConfidenceSliderMenuItem = useSliderMenuItem(
		'Edge confidence threshold',
		ConfidenceThresholdState,
	)
	const correlationSliderMenuItem = useSliderMenuItem(
		'Correlation visibility threshold',
		CorrelationThresholdState,
	)
	const runButtonMenuItem = useRunButtonMenuItem()
	const autoLayoutSliderMenuItem = useAutoLayoutToggleMenuItem()
	const fixedInterventionRangesMenuItem =
		useFixedInterventionRangesToggleMenuItem()

	const menuItems = useMemo<ICommandBarItemProps[]>(
		() => [datasetMenuItems, modelMenuItems, viewMenuItems],
		[datasetMenuItems, modelMenuItems, viewMenuItems],
	)
	const interactiveItems = useMemo(
		() => [
			runButtonMenuItem,
			autoLayoutSliderMenuItem,
			fixedInterventionRangesMenuItem,
			edgeWeightSliderMenuItem,
			edgeConfidenceSliderMenuItem,
			correlationSliderMenuItem,
		],
		[
			runButtonMenuItem,
			autoLayoutSliderMenuItem,
			fixedInterventionRangesMenuItem,
			edgeWeightSliderMenuItem,
			edgeConfidenceSliderMenuItem,
			correlationSliderMenuItem,
		],
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
