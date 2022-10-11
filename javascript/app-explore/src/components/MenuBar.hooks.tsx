/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { Checkbox, ContextualMenuItemType, Toggle } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useDataTables } from '@showwhy/app-common'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo } from 'react'
import type { RecoilState } from 'recoil'
import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	useAutoLayoutEnabled,
	useSetAutoLayoutEnabled,
	useSetPauseAutoRun,
} from '../state/UIState.js'
import { ThresholdSlider } from './controls/ThresholdSlider.js'
import { GraphViewStates } from './graph/GraphViews.types.js'
import { Button, toggleStyles } from './MenuBar.styles.js'

export function useDatasetMenuItems(
	loadTable: (name: string, table: ColumnTable) => void,
): ICommandBarItemProps {
	const dataTables = useDataTables()
	return useMemo(
		() => ({
			key: 'dataset',
			text: 'Dataset',
			subMenuProps: {
				items: [...dataTables.values()].map(dataset => {
					return {
						key: dataset.id,
						text: dataset.name,
						onClick: () => {
							if (dataset.currentOutput?.table) {
								loadTable(dataset.name, dataset.currentOutput?.table)
							}
						},
					}
				}),
			},
		}),
		[dataTables, loadTable],
	)
}

export function useModelMenuItems(
	saveModel: () => void,
	openCausalModelFileSelector: () => void,
	clearModel: () => void,
): ICommandBarItemProps {
	return useMemo(
		() => ({
			key: 'causal-model',
			text: 'Causal Model',
			subMenuProps: {
				items: [
					{
						key: 'save-model',
						text: 'Save Model...',
						onClick: saveModel,
					},
					{
						key: 'load-model',
						text: 'Load Model...',
						onClick: openCausalModelFileSelector,
					},
					{
						key: 'clear-model',
						text: 'Clear Model',
						onClick: clearModel,
					},
				],
			},
		}),
		[saveModel, openCausalModelFileSelector, clearModel],
	)
}

export function useViewMenuItems(
	view: GraphViewStates,
	setView: (s: GraphViewStates) => void,
	useStraightEdges: boolean,
	setUseStraightEdges: (v: boolean) => void,
	autoLayoutEnabled: boolean,
	setAutoLayoutEnabled: (v: boolean) => void,
	showChangesInGraph: boolean,
	setShowChangesInGraph: (v: boolean) => void,
): ICommandBarItemProps {
	return useMemo(
		() => ({
			key: 'view',
			text: 'View',
			subMenuProps: {
				items: [
					{
						key: 'CausalView',
						text: 'Causal Model',
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
					{
						key: 'auto-layout-Checkbox',
						onRender: () => (
							<Checkbox
								label="Auto-layout"
								checked={autoLayoutEnabled}
								onChange={(e, v) => setAutoLayoutEnabled(Boolean(v))}
							/>
						),
					},
				],
			},
		}),
		[
			view,
			setView,
			useStraightEdges,
			setUseStraightEdges,
			autoLayoutEnabled,
			setAutoLayoutEnabled,
			showChangesInGraph,
			setShowChangesInGraph,
		],
	)
}

export function useSliderMenuItem(
	label: string,
	state: RecoilState<number>,
): ICommandBarItemProps {
	return useMemo(
		() => ({
			key: label.toLowerCase().replaceAll(' ', '-'),
			onRender: () => (
				<ThresholdSlider label={label} thresholdState={state} width={200} />
			),
			styles: { padding: '0.5rem' },
		}),
		[label, state],
	)
}

export function useAutoLayoutSliderMenuItem() {
	const autoLayoutEnabled = useAutoLayoutEnabled()
	const setAutoLayoutEnabled = useSetAutoLayoutEnabled()
	return useMemo(
		() => ({
			key: 'auto-layout-toggle',
			onRender: () => (
				<Toggle
					label="Auto-layout"
					checked={autoLayoutEnabled}
					styles={toggleStyles}
					onChange={(e, v) => setAutoLayoutEnabled(Boolean(v))}
				/>
			),
		}),
		[autoLayoutEnabled, setAutoLayoutEnabled],
	)
}

export function useTogglePauseButtonMenuItem() {
	const [paused, { toggle: togglePaused }] = useBoolean(false)
	const setPauseAutoRun = useSetPauseAutoRun()

	useEffect(() => {
		setPauseAutoRun(paused ? CausalDiscoveryAlgorithm.None : undefined)
	}, [paused])

	return useMemo(
		() => ({
			key: 'pause-toggle-button',
			onRender: () => (
				<Button
					toggle
					checked={paused}
					onClick={togglePaused}
					iconProps={{ iconName: paused ? 'Play' : 'Pause' }}
					text={paused ? 'Auto Run' : 'Pause'}
				/>
			),
		}),
		[paused, togglePaused],
	)
}
