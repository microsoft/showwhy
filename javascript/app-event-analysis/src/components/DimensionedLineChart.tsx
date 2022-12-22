/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useRecoilValue } from 'recoil'

import {
	ChartOptionsState,
	OutcomeNameState,
	TreatedUnitsState,
	TreatmentStartDatesState,
} from '../state/state.js'
import type { HoverInfo, TooltipInfo } from '../types.js'
import { ChartErrorFallback } from './ChartErrorFallback.js'
import { useDynamicChartDimensions } from './DimensionedLineChart.hooks.js'
import type { DimensionedLineChartProps } from './DimensionedLineChart.types.js'
import { LineChart } from './LineChart/LineChart.js'
import { Container } from '../styles/index.js'

export const DimensionedLineChart: React.FC<DimensionedLineChartProps> = memo(
	function DimensionedLineChart({
		inputData,
		lineChartRef = null,
		checkableUnits,
		onRemoveCheckedUnit,
		output,
		treatedUnitsList,
		checkedUnits,
		isPlaceboSimulation,
	}) {
		const chartOptions = useRecoilValue(ChartOptionsState)
		const [hoverItem, setHoverItem] = useState<null | TooltipInfo>(null)
		const treatedUnits = useRecoilValue(TreatedUnitsState)
		const outcomeName = useRecoilValue(OutcomeNameState)
		const treatmentStartDates = useRecoilValue(TreatmentStartDatesState)
		const hoverInfo = useMemo(() => {
			return {
				hoverItem: hoverItem,
				setHoverItem: setHoverItem,
			} as HoverInfo
		}, [hoverItem, setHoverItem])

		const {
			renderRawData,
			showTreatmentStart,
			showSynthControl,
			applyIntercept,
			relativeIntercept,
			showGrid,
			showMeanTreatmentEffect,
		} = chartOptions
		const lineChartHeightPercOfWinHeight = 0.35
		const lineChartDimensions = useDynamicChartDimensions(
			lineChartRef,
			lineChartHeightPercOfWinHeight,
		)
		return (
			<Container ref={lineChartRef} className="chartContainer">
				<ErrorBoundary FallbackComponent={ChartErrorFallback}>
					<LineChart
						inputData={inputData}
						outputData={output}
						showSynthControl={showSynthControl}
						showGrid={showGrid}
						applyIntercept={applyIntercept}
						relativeIntercept={relativeIntercept}
						renderRawData={renderRawData}
						showTreatmentStart={showTreatmentStart}
						dimensions={lineChartDimensions}
						hoverInfo={hoverInfo}
						showMeanTreatmentEffect={showMeanTreatmentEffect}
						checkableUnits={checkableUnits}
						onRemoveCheckedUnit={onRemoveCheckedUnit}
						treatedUnits={treatedUnitsList || treatedUnits}
						isPlaceboSimulation={isPlaceboSimulation}
						checkedUnits={checkedUnits}
						outcomeName={outcomeName}
						treatmentStartDates={treatmentStartDates}
					/>
				</ErrorBoundary>
			</Container>
		)
	},
)
