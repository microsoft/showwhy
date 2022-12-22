/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SpinnerSize, Stack } from '@fluentui/react'
import { memo, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import {
	CheckedUnitsState,
	PlaceboSimulationState,
	TreatedUnitsState,
} from '../state/state.js'
import { CustomMessageBar } from './CustomMessageBar.js'
import { DimensionedLineChart } from './DimensionedLineChart.js'
import type { RawDataPaneProps } from './RawDataPane.types.js'
import { GraphTitle, StyledStack } from '../styles/index.js'

export const RawDataPane: React.FC<RawDataPaneProps> = memo(
	function RawDataPane({
		inputData,
		outputData,
		statusMessage,
		isCalculatingEstimator,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const treatedUnits = useRecoilValue(TreatedUnitsState)
		const isPlaceboSimulation = useRecoilValue(PlaceboSimulationState)
		const checkedUnits = useRecoilValue(CheckedUnitsState)
		const rawLineChartRef = useRef<HTMLDivElement | null>(null)

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
					<GraphTitle>Input data</GraphTitle>
				</Stack.Item>

				<Stack.Item>
					<DimensionedLineChart
						inputData={inputData}
						lineChartRef={rawLineChartRef}
						checkableUnits={checkableUnits}
						onRemoveCheckedUnit={onRemoveCheckedUnit}
						output={outputData}
						treatedUnitsList={treatedUnits}
						isPlaceboSimulation={isPlaceboSimulation}
						checkedUnits={checkedUnits}
					/>
				</Stack.Item>
			</StyledStack>
		)
	},
)
