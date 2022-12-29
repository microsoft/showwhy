/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import { memo, useRef } from 'react'

import {
	useCheckedUnitsValueState,
	usePlaceboSimulationValueState,
	useTreatedUnitsValueState,
} from '../state/index.js'
import { GraphTitle, StyledStack } from '../styles/index.js'
import { CustomMessageBar } from './CustomMessageBar.js'
import { DimensionedLineChart } from './DimensionedLineChart.js'
import type { RawDataPaneProps } from './RawDataPane.types.js'

export const RawDataPane: React.FC<RawDataPaneProps> = memo(
	function RawDataPane({
		inputData,
		outputData,
		statusMessage,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const treatedUnits = useTreatedUnitsValueState()
		const isPlaceboSimulation = usePlaceboSimulationValueState()
		const checkedUnits = useCheckedUnitsValueState()
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
