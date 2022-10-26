/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import {
	Checkbox,
	ContextualMenuItemType,
	PrimaryButton,
	Toggle,
} from '@fluentui/react'
import { useDatasetMenuItems as useDatasetMenuItemsCommon, wait } from '@showwhy/app-common'
import { useCallback, useMemo } from 'react'
import type { RecoilState } from 'recoil'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
	AutoLayoutEnabledState,
	AutoRunState,
	DatasetNameState,
	useCausalDiscoveryRunner,
} from '../state/index.js'
import { ThresholdSlider } from './controls/ThresholdSlider.js'
import { GraphViewStates } from './graph/GraphViews.types.js'
import { Button, ButtonWrapper, toggleStyles } from './MenuBar.styles.js'

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
	const [autoLayoutEnabled, setAutoLayoutEnabled] = useRecoilState(
		AutoLayoutEnabledState,
	)
	const handleClick = useCallback(async () => {
		setAutoLayoutEnabled(true)
		await wait(1000)
		setAutoLayoutEnabled(false)
	}, [setAutoLayoutEnabled])

	return useMemo(
		() => ({
			key: 'auto-layout-button',
			onRender: () => (
				<ButtonWrapper>
					<Button
						checked={autoLayoutEnabled}
						onClick={() => void handleClick()}
						text={'Layout'}
						disabled={autoLayoutEnabled}
					/>
					<Toggle
						label="Auto-layout"
						checked={autoLayoutEnabled}
						inlineLabel
						styles={toggleStyles}
						onChange={(e, v) => setAutoLayoutEnabled(Boolean(v))}
					/>
				</ButtonWrapper>
			),
		}),
		[handleClick, autoLayoutEnabled, setAutoLayoutEnabled],
	)
}

export function useRunButtonMenuItem() {
	const [autoRun, setAutoRun] = useRecoilState(AutoRunState)

	const { run, isLoading, stop } = useCausalDiscoveryRunner()
	const handleClick = useCallback(() => {
		return void (isLoading ? stop() : run())
	}, [run, stop, isLoading])

	return useMemo(
		() => ({
			key: 'run-button',
			onRender: () => (
				<ButtonWrapper>
					<PrimaryButton
						onClick={handleClick}
						iconProps={{ iconName: isLoading ? 'Stop' : 'Play' }}
						text={isLoading ? 'Stop' : 'Run'}
						disabled={autoRun}
					/>
					<Toggle
						label="Auto-discovery"
						checked={autoRun}
						inlineLabel
						styles={toggleStyles}
						onChange={(e, v) => setAutoRun(Boolean(v))}
					/>
				</ButtonWrapper>
			),
		}),
		[handleClick, isLoading, autoRun, setAutoRun],
	)
}
