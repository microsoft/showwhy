/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import {
	Checkbox,
	ContextualMenuItemType,
	DefaultButton,
	PrimaryButton,
	Toggle,
} from '@fluentui/react'
import { useDatasetMenuItems as useDatasetMenuItemsCommon } from '@showwhy/app-common'
import { useCallback, useMemo } from 'react'
import type { RecoilState } from 'recoil'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'

import {
	AutoLayoutEnabledState,
	AutoRunState,
	DatasetNameState,
	FixedInterventionRangesEnabledState,
	useCausalDiscoveryRunner,
} from '../state/index.js'
import { ThresholdSlider } from './controls/ThresholdSlider.js'
import { GraphViewStates } from './graph/GraphViews.types.js'
import {
	ButtonWrapper,
	toggleStyles,
	useMenuButtonStyles,
} from './MenuBar.styles.js'

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

export function useAutoLayoutToggleMenuItem() {
	const [autoLayoutEnabled, setAutoLayoutEnabled] = useRecoilState(
		AutoLayoutEnabledState,
	)
	const handleClick = useRecoilCallback(
		({ snapshot, set }) =>
			async () => {
				set(AutoLayoutEnabledState, true)
				const autoLayoutSnapshot = await snapshot.getPromise(
					AutoLayoutEnabledState,
				)
				if (autoLayoutSnapshot) {
					setTimeout(() => {
						set(AutoLayoutEnabledState, false)
					}, 10)
				}
			},
		[],
	)

	const menuProps = useMemo(
		() => ({
			items: [
				{
					key: 'autoLayout',
					text: 'Auto-layout',
					onClick: () => setAutoLayoutEnabled(true),
				},
			],
		}),
		[setAutoLayoutEnabled],
	)

	return useMemo(
		() => ({
			key: 'auto-layout-button',
			onRender: () => (
				<ButtonWrapper>
					<DefaultButton
						split
						menuProps={menuProps}
						checked={autoLayoutEnabled}
						onClick={() => void handleClick()}
						text={autoLayoutEnabled ? 'Auto-layout' : 'Layout'}
					/>
				</ButtonWrapper>
			),
		}),
		[handleClick, autoLayoutEnabled, menuProps],
	)
}

export function useRunButtonMenuItem() {
	const [autoRun, setAutoRun] = useRecoilState(AutoRunState)
	const { run, isLoading, stop } = useCausalDiscoveryRunner()
	const isRunning = useMemo(
		(): boolean => isLoading || autoRun,
		[isLoading, autoRun],
	)

	const handleClick = useCallback(() => {
		return void (isRunning ? stop() : run())
	}, [run, stop, isRunning])

	const menuProps = useMemo(
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
				<ButtonWrapper>
					<PrimaryButton
						split
						menuProps={menuProps}
						onClick={handleClick}
						iconProps={{ iconName: isRunning ? 'Pause' : 'Play' }}
						text={isRunning ? 'Stop run' : 'Run'}
					/>
				</ButtonWrapper>
			),
		}),
		[handleClick, isRunning, menuProps],
	)
}
