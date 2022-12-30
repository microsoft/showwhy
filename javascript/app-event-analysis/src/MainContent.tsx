/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem, Stack } from '@fluentui/react'
import { isEmpty } from 'lodash'
import { memo, useCallback, useEffect, useRef } from 'react'

import { useProcessedInputData } from './hooks/useProcessedInputData.js'
import { StyledStack, usePivotStyles } from './MainContent.styles.js'
import { EstimateEffects } from './pages/EstimateEffects/index.js'
import { PrepareAnalysis } from './pages/PrepareAnalysis/index.js'
import { ValidateEffects } from './pages/ValidateEffects/index.js'
import {
	useCheckedUnitsState,
	useColumnMappingState,
	useSelectedTabKeyState,
	useTreatedUnitsState,
	useTreatmentStartDatesState,
} from './state/index.js'
import { CONFIGURATION_TABS } from './types.js'

export const MainContent: React.FC = memo(function MainContent() {
	const [columnMapping] = useColumnMappingState()
	const { data, defaultTreatment } = useProcessedInputData(columnMapping)
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()
	const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()
	const [selectedTabKey, setSelectedTabKey] = useSelectedTabKeyState()
	const isInitialRender = useRef(true)

	useEffect(() => {
		// initially, all units are checked
		if (checkedUnits === null && data.uniqueUnits.length) {
			setCheckedUnits(new Set(data.uniqueUnits))
		}
	}, [data, checkedUnits, setCheckedUnits])

	useEffect(() => {
		if (
			defaultTreatment !== null &&
			(isEmpty(treatedUnits) ||
				isEmpty(treatmentStartDates) ||
				!isInitialRender.current)
		) {
			setTreatmentStartDates(defaultTreatment.startDates)
			setTreatedUnits(defaultTreatment.units)
		}
		isInitialRender.current = false
	}, [defaultTreatment])

	const onHandleTabClicked = useCallback(
		(itemClicked?: PivotItem) => {
			const itemKey = itemClicked?.props.itemKey
				? itemClicked.props.itemKey
				: ''
			setSelectedTabKey(itemKey)
		},
		[setSelectedTabKey],
	)

	const pivotStyles = usePivotStyles()
	return (
		<StyledStack grow horizontal verticalFill className="synthdid-container">
			<Stack.Item>
				<Stack tokens={{ childrenGap: 8 }} className="leftPanel">
					<Pivot
						aria-label="SynthDiD Navigation Tabs"
						className="tabControl"
						onLinkClick={onHandleTabClicked}
						selectedKey={selectedTabKey}
						styles={pivotStyles}
					>
						<PivotItem
							headerText={CONFIGURATION_TABS.prepareAnalysis.label}
							itemKey={CONFIGURATION_TABS.prepareAnalysis.key}
						>
							<PrepareAnalysis />
						</PivotItem>
						<PivotItem
							headerText={CONFIGURATION_TABS.estimateEffects.label}
							itemKey={CONFIGURATION_TABS.estimateEffects.key}
						>
							<EstimateEffects />
						</PivotItem>
						<PivotItem
							headerText={CONFIGURATION_TABS.validateEffects.label}
							itemKey={CONFIGURATION_TABS.validateEffects.key}
						>
							<ValidateEffects />
						</PivotItem>
					</Pivot>
				</Stack>
			</Stack.Item>

			{/* <Stack.Item grow className="rightPanel">
				// TODO: Move out header
				<RightPanelHeader>
					<Stack tokens={{ childrenGap: 5 }}>
						<Title>
							For treated {units || '<units>'}, did {eventName || '<event>'}{' '}
							cause {outcomeName || '<outcome>'} to{' '}
							{hypothesis?.toLowerCase() || '<hypothesis>'}?
						</Title>
					</Stack>
				</RightPanelHeader>
				{showRawDataLineChart && (
					<RawDataPane
						inputData={data}
						outputData={outputData}
						statusMessage={userMessage}
						checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				)}
				{selectedTabKey === CONFIGURATION_TABS.estimateEffects.key && (
					<EffectResultPane
						inputData={data}
						outputData={outputData}
						synthControlData={synthControlData}
						statusMessage={userMessage}
						isLoading={isCalculatingEstimator}
						timeAlignment={timeAlignment}
						checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				)}
				{showPlaceboGraphs && (
					<PlaceboResultPane
						inputData={data}
						statusMessage={userMessage}
						isCalculatingEstimator={isCalculatingEstimator}
						placeboDataGroup={placeboDataGroup}
						placeboOutputData={placeboOutputData}
						checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				)}
			</Stack.Item> */}
		</StyledStack>
	)
})
