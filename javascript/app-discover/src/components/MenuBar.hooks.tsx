/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ICommandBarItemProps,
	IContextualMenuProps,
} from '@fluentui/react'
import {
	Checkbox,
	ContextualMenuItemType,
	DefaultButton,
	Label,
	PrimaryButton,
	Toggle,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useDatasetMenuItems as useDatasetMenuItemsCommon } from '@showwhy/app-common'
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
	AutoRunState,
	DatasetNameState,
	DatasetStatisticsState,
	FixedInterventionRangesEnabledState,
	useCausalDiscoveryRunner,
	useLayoutGraph,
} from '../state/index.js'
import { GraphViewStates } from './graph/GraphViews.types.js'
import { toggleStyles, useMenuButtonStyles } from './MenuBar.styles.js'

export function useDatasetMenuItems(
	loadTable: (name: string) => void,
): ICommandBarItemProps {
	const selectedTable = useRecoilValue(DatasetNameState)
	return useDatasetMenuItemsCommon(selectedTable, loadTable)
}

export function useModelMenuItems(
	saveModel: () => void,
	openCausalModelFileSelector: () => void,
	clearModel: () => void,
): ICommandBarItemProps {
	const buttonStyles = useMenuButtonStyles()
	return useMemo(
		() => ({
			key: 'causal-model',
			text: 'Causal model',
			buttonStyles,
			subMenuProps: {
				items: [
					{
						key: 'save-model',
						text: 'Save model...',
						onClick: saveModel,
					},
					{
						key: 'load-model',
						text: 'Load model...',
						onClick: openCausalModelFileSelector,
					},
					{
						key: 'clear-model',
						text: 'Clear model',
						onClick: clearModel,
					},
				],
			},
		}),
		[saveModel, openCausalModelFileSelector, clearModel, buttonStyles],
	)
}

export function useViewMenuItems(
	view: GraphViewStates,
	setView: (s: GraphViewStates) => void,
	useStraightEdges: boolean,
	setUseStraightEdges: (v: boolean) => void,
): ICommandBarItemProps {
	const buttonStyles = useMenuButtonStyles()
	return useMemo(
		() => ({
			key: 'view',
			text: 'View',
			buttonStyles,
			subMenuProps: {
				items: [
					{
						key: 'CausalView',
						text: 'Causal model',
						iconProps: {
							iconName:
								view === GraphViewStates.CausalView
									? 'CircleFill'
									: 'CircleRing',
						},
						onClick: () => setView(GraphViewStates.CausalView),
					},
					{
						key: 'CorrelationView2D',
						text: 'Correlations (2D)',
						iconProps: {
							iconName:
								view === GraphViewStates.CorrelationView2D
									? 'CircleFill'
									: 'CircleRing',
						},
						onClick: () => setView(GraphViewStates.CorrelationView2D),
					},
					{
						key: 'CorrelationView3D',
						text: 'Correlations (3D)',
						iconProps: {
							iconName:
								view === GraphViewStates.CorrelationView3D
									? 'CircleFill'
									: 'CircleRing',
						},
						onClick: () => setView(GraphViewStates.CorrelationView3D),
					},
					{
						key: 'divider',
						name: '-',
						itemType: ContextualMenuItemType.Divider,
					},
					{
						key: 'straight-edge-Checkbox',
						onRender: () => (
							<Checkbox
								label="Use straight edges"
								checked={useStraightEdges}
								onChange={(e, v) => setUseStraightEdges(Boolean(v))}
							/>
						),
					},
				],
			},
		}),
		[view, setView, useStraightEdges, setUseStraightEdges, buttonStyles],
	)
}

export function useFixedInterventionRangesToggleMenuItem() {
	const [fixedInterventionRangesEnabled, setFixedInterventionRangesEnabled] =
		useRecoilState(FixedInterventionRangesEnabledState)
	return useMemo(
		() => ({
			key: 'fixed-intervention-ranges-toggle',
			onRender: () => (
				<Toggle
					label="Fixed ranges"
					checked={fixedInterventionRangesEnabled}
					inlineLabel
					styles={toggleStyles}
					onChange={(e, v) => setFixedInterventionRangesEnabled(Boolean(v))}
				/>
			),
		}),
		[fixedInterventionRangesEnabled, setFixedInterventionRangesEnabled],
	)
}

export function useAutoLayoutButtonMenuItem() {
	const [autoLayout, { toggle: toggleAutoLayout, setFalse }] = useBoolean(false)
	const layoutGraph = useLayoutGraph()

	useEffect(() => {
		if (autoLayout) {
			void layoutGraph()
		}
	}, [autoLayout, layoutGraph])

	const menuProps = useMemo<IContextualMenuProps>(
		() => ({
			items: [
				{
					key: 'autoLayout',
					text: 'Auto-layout',
					onClick: toggleAutoLayout,
				},
			],
		}),
		[toggleAutoLayout],
	)

	return useMemo(
		() => ({
			key: 'auto-layout-button',
			onRender: () => (
				<DefaultButton
					split
					menuProps={menuProps}
					checked={autoLayout}
					onClick={autoLayout ? setFalse : layoutGraph}
					text={autoLayout ? 'Auto-layout' : 'Layout'}
				/>
			),
		}),
		[autoLayout, layoutGraph, setFalse, menuProps],
	)
}

export function useRunButtonMenuItem() {
	const [autoRun, setAutoRun] = useRecoilState(AutoRunState)
	const { run, isLoading, stop } = useCausalDiscoveryRunner()
	const isRunning = useMemo<boolean>(
		() => isLoading || autoRun,
		[isLoading, autoRun],
	)

	const handleClick = useCallback(() => {
		return void (isRunning ? stop() : run())
	}, [run, stop, isRunning])

	const menuProps = useMemo<IContextualMenuProps>(
		() => ({
			items: [
				{
					key: 'autoRun',
					text: 'Auto run',
					iconProps: { iconName: 'PlaybackRate1x' },
					onClick: () => setAutoRun(true),
				},
			],
		}),
		[setAutoRun],
	)

	return useMemo(
		() => ({
			key: 'run-button',
			onRender: () => (
				<PrimaryButton
					split
					menuProps={menuProps}
					onClick={handleClick}
					iconProps={{ iconName: isRunning ? 'Pause' : 'Play' }}
					text={isRunning ? 'Stop run' : 'Run'}
				/>
			),
		}),
		[handleClick, isRunning, menuProps],
	)
}

export function useDatasetStatisticsMenuItem() {
	const datasetStatistics = useRecoilValue(DatasetStatisticsState)

	return useMemo(
		() => ({
			key: 'dataset-statistics',

			onRender: () =>
				datasetStatistics !== undefined &&
				datasetStatistics.numberOfRows > 0 ? (
					<Label>
						Results for {datasetStatistics.numberOfRows} records (
						{(
							(datasetStatistics.numberOfDroppedRows * 100.0) /
							datasetStatistics.numberOfRows
						).toFixed(2)}
						% missing/dropped)
					</Label>
				) : null,
		}),
		[datasetStatistics],
	)
}
