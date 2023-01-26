/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { memo, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import {
	useChartOptionsValueState,
	useCheckedUnitsValueState,
	useEventNameValueState,
	useOutcomeNameValueState,
	useTreatedUnitsValueState,
} from '../../state/index.js'
import { Container, Strong, TreatedTitle } from '../../styles/index.js'
import type { LineData, OutputData } from '../../types.js'
import {
	BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
	BarChartOrientation,
} from '../../types.js'
import { BarChart } from '../BarChart/index.js'
import { ChartErrorFallback } from '../ChartErrorFallback.js'
import { useDynamicChartDimensions } from '../DimensionedLineChart.hooks.js'
import { DimensionedLineChart } from '../DimensionedLineChart.js'
import type { EffectResultProps } from './EffectResult.types.js'
import { useSynthControlBarChartData } from './EffectResultPane.hooks.js'

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
		const eventName = useEventNameValueState()
		const chartOptions = useChartOptionsValueState()
		const outcomeName = useOutcomeNameValueState()
		const treatedUnits = useTreatedUnitsValueState()
		const checkedUnits = useCheckedUnitsValueState()
		const ref = useRef<HTMLDivElement | null>(null)
		const barChartRef = useRef<HTMLDivElement | null>(null)

		const { showChartPerUnit } = chartOptions

		const barChartDimensions = useDynamicChartDimensions(
			barChartRef,
			BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
		)

		const synthControlBarChartData =
			useSynthControlBarChartData(synthControlData)

		const output =
			outputData.find((o) => o.treatedUnit === treatedUnit) ||
			({} as OutputData)

		const filteredOutput = {
			...output,
			output_lines_control: output.output_lines_control.filter(
				(l: LineData[]) => l[0].unit.includes(treatedUnit),
			),
			output_lines_treated: output.output_lines_treated.filter(
				(l: LineData[]) => l[0].unit.includes(treatedUnit),
			),
		}

		return (
			<Container key={treatedUnit}>
				<TreatedTitle>{treatedUnit}</TreatedTitle>
				{showChartPerUnit && (
					<DimensionedLineChart
						inputData={inputData}
						lineChartRef={ref}
						checkableUnits={checkableUnits}
						onRemoveCheckedUnit={onRemoveCheckedUnit}
						output={[filteredOutput]}
						treatedUnitsList={[treatedUnit]}
						checkedUnits={checkedUnits}
					/>
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
						/>
					</ErrorBoundary>
				</Container>
			</Container>
		)
	},
)
