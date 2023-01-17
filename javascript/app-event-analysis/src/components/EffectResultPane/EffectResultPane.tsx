/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SpinnerSize } from '@fluentui/react'
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
import { GraphTitle, PaneContainer } from '../../styles/index.js'
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
		isLoading,
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
				!isLoading &&
				outputData.length > 0 &&
				treatedUnits.length > 0 &&
				selectedTabKey === CONFIGURATION_TABS.estimateEffects.key
			)
		}, [isLoading, outputData, treatedUnits, selectedTabKey])

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
			<PaneContainer>
				{statusMessage.isVisible && (
					<CustomMessageBar
						content={statusMessage.content}
						type={statusMessage.type}
					/>
				)}

				{isLoading && <Spinner size={SpinnerSize.medium} />}

				<GraphTitle>
					Effect of {eventName} on {outcomeName}
				</GraphTitle>

				{showSyntheticComposition && (
					<>
						<EffectSummaryResult
							inputData={inputData}
							outputData={outputData}
							timeAlignment={timeAlignment}
						/>
						{!showChartPerUnit && (
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
						)}
						{effectResult}
					</>
				)}
			</PaneContainer>
		)
	},
)
