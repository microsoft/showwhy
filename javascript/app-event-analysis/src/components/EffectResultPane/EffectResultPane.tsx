/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SpinnerSize, Stack } from '@fluentui/react'
import { memo, useMemo, useRef, useState } from 'react'

import {
	useChartOptionsValueState,
	useCheckedUnitsValueState,
	useEventNameValueState,
	useOutcomeNameValueState,
	usePlaceboSimulationValueState,
	useSelectedTabKeyValueState,
	useTreatedUnitsValueState,
} from '../../state/index.js'
import { GraphTitle, StyledStack } from '../../styles/index.js'
import type { HoverInfo, TooltipInfo } from '../../types.js'
import { CONFIGURATION_TABS } from '../../types.js'
import { CustomMessageBar } from '../CustomMessageBar.js'
import { DimensionedLineChart } from '../DimensionedLineChart.js'
import { EffectResult } from './EffectResult.js'
import type { EffectResultPaneProps } from './EffectResultPane.types.js'
import { EffectSummaryResult } from './EffectSummaryResult.js'

export const EffectResultPane: React.FC<EffectResultPaneProps> = memo(
	function EffectResultPane({
		inputData,
		outputData,
		synthControlData,
		statusMessage,
		isCalculatingEstimator,
		timeAlignment,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const [hoverItem, setHoverItem] = useState<null | TooltipInfo>(null)

		const eventName = useEventNameValueState()
		const chartOptions = useChartOptionsValueState()
		const outcomeName = useOutcomeNameValueState()
		const treatedUnits = useTreatedUnitsValueState()
		const isPlaceboSimulation = usePlaceboSimulationValueState()
		const selectedTabKey = useSelectedTabKeyValueState()
		const checkedUnits = useCheckedUnitsValueState()
		const synthLineChartRef = useRef<HTMLDivElement | null>(null)

		const hoverInfo = useMemo(() => {
			return {
				hoverItem: hoverItem,
				setHoverItem: setHoverItem,
			} as HoverInfo
		}, [hoverItem, setHoverItem])

		const { showChartPerUnit } = chartOptions

		const showSyntheticComposition = useMemo((): boolean => {
			return (
				!isCalculatingEstimator &&
				outputData.length > 0 &&
				treatedUnits.length > 0 &&
				selectedTabKey === CONFIGURATION_TABS.estimateEffects.key
			)
		}, [isCalculatingEstimator, outputData, treatedUnits, selectedTabKey])

		const effectResult = useMemo(
			() =>
				treatedUnits
					.filter((unit: string) => synthControlData[unit] !== undefined)
					.map((treatedUnit: string) => (
						<EffectResult
							key={treatedUnit}
							treatedUnit={treatedUnit}
							inputData={inputData}
							outputData={outputData}
							hoverInfo={hoverInfo}
							synthControlData={synthControlData}
							checkableUnits={checkableUnits}
							onRemoveCheckedUnit={onRemoveCheckedUnit}
						/>
					)),
			[
				inputData,
				treatedUnits,
				synthControlData,
				outputData,
				hoverInfo,
				checkableUnits,
				onRemoveCheckedUnit,
			],
		)

		return (
			<StyledStack grow verticalFill tokens={{ childrenGap: 15 }}>
				<Stack.Item className="statusMessage">
					{statusMessage.isVisible && (
						<CustomMessageBar
							content={statusMessage.content}
							type={statusMessage.type}
						/>
					)}
				</Stack.Item>

				<Stack.Item className="no-top-margin">
					{isCalculatingEstimator && <Spinner size={SpinnerSize.medium} />}
				</Stack.Item>

				<Stack.Item className="no-top-margin">
					<GraphTitle>
						Effect of {eventName} on {outcomeName}
					</GraphTitle>
				</Stack.Item>

				{showSyntheticComposition && (
					<>
						<Stack.Item>
							<EffectSummaryResult
								inputData={inputData}
								outputData={outputData}
								timeAlignment={timeAlignment}
							/>
						</Stack.Item>
						{!showChartPerUnit && (
							<Stack.Item>
								<DimensionedLineChart
									inputData={inputData}
									lineChartRef={synthLineChartRef}
									checkableUnits={checkableUnits}
									onRemoveCheckedUnit={onRemoveCheckedUnit}
									output={outputData}
									treatedUnitsList={treatedUnits}
									isPlaceboSimulation={isPlaceboSimulation}
									checkedUnits={checkedUnits}
								/>
							</Stack.Item>
						)}
						{effectResult}
						{/* <Stack.Item>{effectResult}</Stack.Item> */}
					</>
				)}
			</StyledStack>
		)
	},
)
