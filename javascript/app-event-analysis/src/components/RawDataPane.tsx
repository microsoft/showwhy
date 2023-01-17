/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useRef } from 'react'

import {
	useCheckedUnitsValueState,
	useTreatedUnitsValueState,
} from '../state/index.js'
import { GraphTitle, PaneContainer } from '../styles/index.js'
import { DimensionedLineChart } from './DimensionedLineChart.js'
import type { RawDataPaneProps } from './RawDataPane.types.js'

export const RawDataPane: React.FC<RawDataPaneProps> = memo(
	function RawDataPane({
		inputData,
		outputData,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const treatedUnits = useTreatedUnitsValueState()
		const checkedUnits = useCheckedUnitsValueState()
		const rawLineChartRef = useRef<HTMLDivElement | null>(null)

		return (
			<PaneContainer>
				<GraphTitle>Input data</GraphTitle>

				<DimensionedLineChart
					inputData={inputData}
					lineChartRef={rawLineChartRef}
					checkableUnits={checkableUnits}
					onRemoveCheckedUnit={onRemoveCheckedUnit}
					output={outputData}
					treatedUnitsList={treatedUnits}
					checkedUnits={checkedUnits}
				/>
			</PaneContainer>
		)
	},
)
