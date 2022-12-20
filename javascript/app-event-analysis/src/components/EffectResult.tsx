/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, Text } from '@fluentui/react'
import { memo, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useRecoilValue } from 'recoil'

import {
	ChartOptionsState,
	CheckedUnitsState,
	EventNameState,
	OutcomeNameState,
	PlaceboSimulationState,
	TreatedUnitsState,
} from '../state/state.js'
import type { OutputData } from '../types.js'
import {
	BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
	BarChartOrientation,
} from '../types.js'
import { BarChart } from './BarChart.js'
import { ChartErrorFallback } from './ChartErrorFallback.js'
import { useDynamicChartDimensions } from './DimensionedLineChart.hooks.js'
import { DimensionedLineChart } from './DimensionedLineChart.js'
import type { EffectResultProps } from './EffectResult.types.js'
import { useSynthControlBarChartData } from './EffectResultPane.hooks.js'
import { TreatedTitle } from './ResultPane.styles.js'
import Spacer from './style/Spacer.js'
import { Container, Strong } from './style/Styles.js'

export const EffectResult: React.FC<EffectResultProps> = memo(
	function EffectResult({
		treatedUnit,
		inputData,
		outputData,
		hoverInfo,
		synthControlData,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const eventName = useRecoilValue(EventNameState)
		const chartOptions = useRecoilValue(ChartOptionsState)
		const outcomeName = useRecoilValue(OutcomeNameState)
		const treatedUnits = useRecoilValue(TreatedUnitsState)
		const isPlaceboSimulation = useRecoilValue(PlaceboSimulationState)
		const checkedUnits = useRecoilValue(CheckedUnitsState)
		const ref = useRef<HTMLDivElement | null>(null)
		const barChartRef = useRef<HTMLDivElement | null>(null)

		const { showChartPerUnit } = chartOptions

		const barChartDimensions = useDynamicChartDimensions(
			barChartRef,
			BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
			synthControlData,
		)

		const synthControlBarChartData =
			useSynthControlBarChartData(synthControlData)

		const output =
			outputData.find(o => o.treatedUnit === treatedUnit) || ({} as OutputData)

		const filteredOutput = {
			...output,
			output_lines_control: output.output_lines_control.filter(l =>
				l[0].unit.includes(treatedUnit),
			),
			output_lines_treated: output.output_lines_treated.filter(l =>
				l[0].unit.includes(treatedUnit),
			),
		}

		return (
			<Stack key={treatedUnit} tokens={{ padding: 10 }}>
				<TreatedTitle>{treatedUnit}</TreatedTitle>
				<Spacer axis="vertical" size={10} />
				{showChartPerUnit && (
					<Stack.Item>
						<DimensionedLineChart
							inputData={inputData}
							lineChartRef={ref}
							checkableUnits={checkableUnits}
							onRemoveCheckedUnit={onRemoveCheckedUnit}
							output={[filteredOutput]}
							treatedUnitsList={[treatedUnit]}
							isPlaceboSimulation={isPlaceboSimulation}
							checkedUnits={checkedUnits}
						/>
					</Stack.Item>
				)}

				<Text className="infoText synth-control-text-margin" variant="medium">
					This outcome was calculated by comparing the actual{' '}
					<Strong>{outcomeName}</Strong> data from{' '}
					<Strong>{treatedUnit}</Strong> with a{' '}
					<Strong className="control-label">control group</Strong> composed of
					weighted combinations of the following{' '}
					<Strong>
						{synthControlData[treatedUnit].length} {'units'},
					</Strong>{' '}
					intended to closely match the expected trajectory of{' '}
					<Strong>{treatedUnit}</Strong> without <Strong>{eventName}.</Strong>
				</Text>
				<Container ref={barChartRef} className="chartContainer">
					<ErrorBoundary FallbackComponent={ChartErrorFallback}>
						<BarChart
							inputData={synthControlBarChartData[treatedUnit]}
							dimensions={barChartDimensions}
							orientation={BarChartOrientation[BarChartOrientation.row]}
							hoverInfo={hoverInfo}
							leftAxisLabel={''}
							bottomAxisLabel={'Weight'}
							checkableUnits={checkableUnits}
							onRemoveCheckedUnit={onRemoveCheckedUnit}
							treatedUnits={treatedUnits}
							checkedUnits={checkedUnits}
							isPlaceboSimulation={isPlaceboSimulation}
						/>
					</ErrorBoundary>
				</Container>
			</Stack>
		)
	},
)
