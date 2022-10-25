/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import { Checkbox, ContextualMenuItemType, Toggle } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useDataTables } from '@showwhy/app-common'
import { useEffect, useMemo } from 'react'
import type { RecoilState } from 'recoil'
import { useRecoilState, useRecoilValue } from 'recoil'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	AutoLayoutEnabledState,
	DatasetNameState,
	PauseAutoRunState,
} from '../state/index.js'
import { ThresholdSlider } from './controls/ThresholdSlider.js'
import { GraphViewStates } from './graph/GraphViews.types.js'
import { Button, toggleStyles, useMenuButtonStyles } from './MenuBar.styles.js'

export function useDatasetMenuItems(
	loadTable: (name: string) => void,
): ICommandBarItemProps {
	const selectedTable = useRecoilValue(DatasetNameState)
	const dataTables = useDataTables()
	const buttonStyles = useMenuButtonStyles()
	return useMemo(
		() => ({
			key: 'dataset',
			text: selectedTable || 'Dataset',
			buttonStyles,
			subMenuProps: {
				items: [...dataTables.values()].map(dataset => {
					return {
						key: dataset.id,
						text: dataset.name,
						onClick: () => {
							loadTable(dataset.name)
						},
					}
				}),
			},
		}),
		[dataTables, loadTable, buttonStyles],
	)
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
	autoLayoutEnabled: boolean,
	setAutoLayoutEnabled: (v: boolean) => void,
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
			buttonStyles,
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
				<ThresholdSlider label={label} thresholdState={state} width={180} />
			),
		}),
		[label, state],
	)
}

export function useAutoLayoutToggleMenuItem() {
	const [autoLayoutEnabled, setAutoLayoutEnabled] = useRecoilState(
		AutoLayoutEnabledState,
	)
	return useMemo(
		() => ({
			key: 'auto-layout-toggle',
			onRender: () => (
				<Toggle
					label="Auto-layout"
					checked={autoLayoutEnabled}
					inlineLabel
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
	const [, setPauseAutoRun] = useRecoilState(PauseAutoRunState)

	useEffect(() => {
		setPauseAutoRun(paused ? CausalDiscoveryAlgorithm.None : undefined)
	}, [paused, setPauseAutoRun])

	return useMemo(
		() => ({
			key: 'pause-toggle-button',

			onRender: () => (
				<Button
					toggle
					checked={paused}
					onClick={togglePaused}
					iconProps={{ iconName: paused ? 'Play' : 'Pause' }}
					text={paused ? 'Auto-run' : 'Pause'}
				/>
			),
		}),
		[paused, togglePaused],
	)
}
