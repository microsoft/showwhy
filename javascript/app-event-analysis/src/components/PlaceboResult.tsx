/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, Text } from '@fluentui/react'
import { memo, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useRecoilValue } from 'recoil'

import {
	CheckedUnitsState,
	EventNameState,
	HypothesisState,
	OutcomeNameState,
	TreatedUnitsState,
	UnitsState,
} from '../state/state.js'
import type { PlaceboOutputData } from '../types.js'
import {
	BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
	BarChartOrientation,
} from '../types.js'
import { isValidUnit } from '../utils/validation.js'
import { BarChart } from './BarChart.js'
import { ChartErrorFallback } from './ChartErrorFallback.js'
import { useDynamicChartDimensions } from './DimensionedLineChart.hooks.js'
import { DimensionedLineChart } from './DimensionedLineChart.js'
import {
	useGetPlaceboBarChartInputData,
	useGetPlaceboResults,
	useGetTreatedPlaceboP,
} from './PlaceboResult.hooks.js'
import type { PlaceboResultProps } from './PlaceboResult.types.js'
import { getSdidEstimate } from './PlaceboResult.utils.js'
import Spacer from './style/Spacer.js'
import { Container, Section, TreatedTitle } from './style/Styles.js'

export const PlaceboResult: React.FC<PlaceboResultProps> = memo(
	function PlaceboResult({
		treatedUnit,
		hoverInfo,
		inputData,
		placeboDataGroup,
		placeboOutputData,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const eventName = useRecoilValue(EventNameState)
		const outcomeName = useRecoilValue(OutcomeNameState)
		const treatedUnits = useRecoilValue(TreatedUnitsState)
		const hypothesis = useRecoilValue(HypothesisState)
		const units = useRecoilValue(UnitsState)
		const checkedUnits = useRecoilValue(CheckedUnitsState)
		const getPlaceboResults = useGetPlaceboResults()
		const getTreatedPlaceboP = useGetTreatedPlaceboP()
		const getPlaceboBarChartInputData = useGetPlaceboBarChartInputData()

		const placeboBarChartRef = useRef<HTMLDivElement | null>(null)

		const placeboBarChartDimensions = useDynamicChartDimensions(
			placeboBarChartRef,
			BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
		)
		const placeboLineChartRef = useRef<HTMLDivElement | null>(null)

		const pdg = placeboDataGroup.get(treatedUnit)
		if (!pdg) return null
		const output = placeboOutputData.get(treatedUnit) as PlaceboOutputData[]
		const placeboBarChartInputData = getPlaceboBarChartInputData(pdg, output[0])
		const sdidEstimate = output[0] ? getSdidEstimate(treatedUnit, output[0]) : 0
		const treatedPlaceboP = getTreatedPlaceboP(
			treatedUnit,
			placeboBarChartInputData,
		)
		const placeboResult = getPlaceboResults(
			treatedPlaceboP,
			sdidEstimate,
			treatedUnit,
		)

		return (
			<Section key={treatedUnit}>
				<Stack.Item>
					<TreatedTitle>{treatedUnit}</TreatedTitle>
				</Stack.Item>

				<Spacer axis="vertical" size={15} />

				<Stack.Item>
					<DimensionedLineChart
						inputData={inputData}
						lineChartRef={placeboLineChartRef}
						checkableUnits={checkableUnits}
						onRemoveCheckedUnit={onRemoveCheckedUnit}
						output={output}
						treatedUnitsList={[treatedUnit]}
						checkedUnits={checkedUnits}
						isPlaceboSimulation
					/>
				</Stack.Item>

				<Spacer axis="vertical" size={15} />

				<Stack.Item className={'no-top-margin'}>
					<Text className="infoText" variant="medium">
						The following visualization shows how the post-treatment divergence
						between the treated unit <b>{treatedUnit}</b> and its control group
						(highlighted) compares with the set of divergence scores calculated
						for each placebo unit. If the treatment was the true cause of the
						observed effect, we would expect actual treated units to have
						extreme divergence scores overall (following exclusion of units with
						poor control group fit).
					</Text>
				</Stack.Item>

				<Spacer axis="vertical" size={10} />

				<Stack.Item className={'no-top-margin'}>
					<Container ref={placeboBarChartRef} className="chartContainer">
						<ErrorBoundary FallbackComponent={ChartErrorFallback}>
							<BarChart
								inputData={placeboBarChartInputData}
								dimensions={placeboBarChartDimensions}
								orientation={BarChartOrientation[BarChartOrientation.column]}
								hoverInfo={hoverInfo}
								leftAxisLabel={'Ratio'}
								bottomAxisLabel={''}
								checkableUnits={checkableUnits}
								onRemoveCheckedUnit={onRemoveCheckedUnit}
								renderLegend
								treatedUnits={treatedUnits}
								checkedUnits={checkedUnits}
								isPlaceboSimulation
							/>
						</ErrorBoundary>
					</Container>
				</Stack.Item>

				<Stack.Item className={'no-top-margin'}>
					{isValidUnit(treatedUnit) && placeboResult && (
						<Text className="infoText last-item-margin" variant="medium">
							The answer to the overall question of:{' '}
							<Text variant="medium">
								For treated {units}, did {eventName} cause {outcomeName} to{' '}
								{hypothesis}?
							</Text>{' '}
							is therefore:
							<Text variant="medium" block>
								{placeboResult}
							</Text>
						</Text>
					)}
				</Stack.Item>
			</Section>
		)
	},
)
