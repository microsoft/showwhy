/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text } from '@fluentui/react'
import { memo, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import {
	useCheckedUnitsValueState,
	useEventNameValueState,
	useHypothesisValueState,
	useOutcomeNameValueState,
	useTreatedUnitsValueState,
	useUnitsValueState,
} from '../../state/index.js'
import { Container, TreatedTitle } from '../../styles/index.js'
import type { PlaceboOutputData } from '../../types.js'
import {
	BAR_CHART_HEIGHT_PERC_OF_WIN_HEIGHT,
	BarChartOrientation,
} from '../../types.js'
import { isValidUnit } from '../../utils/validation.js'
import { BarChart } from '../BarChart/index.js'
import { ChartErrorFallback } from '../ChartErrorFallback.js'
import { useDynamicChartDimensions } from '../DimensionedLineChart.hooks.js'
import { DimensionedLineChart } from '../DimensionedLineChart.js'
import {
	useGetPlaceboBarChartInputData,
	useGetPlaceboResults,
	useGetTreatedPlaceboP,
} from './PlaceboResult.hooks.js'
import type { PlaceboResultProps } from './PlaceboResult.types.js'
import { getSdidEstimate } from './PlaceboResult.utils.js'

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
		const eventName = useEventNameValueState()
		const outcomeName = useOutcomeNameValueState()
		const treatedUnits = useTreatedUnitsValueState()
		const hypothesis = useHypothesisValueState()
		const units = useUnitsValueState()
		const checkedUnits = useCheckedUnitsValueState()
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
				<Container>
					<TreatedTitle>{treatedUnit}</TreatedTitle>
				</Container>
				<Container>
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
				</Container>
				<Container className={'no-top-margin'}>
					<Text className="infoText" variant="medium">
						The following visualization shows how the post-treatment divergence
						between the treated unit <b>{treatedUnit}</b> and its control group
						(highlighted) compares with the set of divergence scores calculated
						for each placebo unit. If the treatment was the true cause of the
						observed effect, we would expect actual treated units to have
						extreme divergence scores overall (following exclusion of units with
						poor control group fit).
					</Text>
				</Container>
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
				<Container>
					{isValidUnit(treatedUnit) && placeboResult && (
						<Text className="infoText last-item-margin" variant="medium">
							The answer to the question of:{' '}
							<Text variant="medium">
								For the treated {units} of {treatedUnit}, did {eventName} cause {outcomeName} to{' '}
								{hypothesis}?
							</Text>{' '}
							is therefore:
							<Text variant="medium" block>
								{placeboResult}
							</Text>
						</Text>
					)}
				</Container>
			</Section>
		)
	},
)

const Section = styled.section`
	display: flex;
	gap: 1rem;
	flex-direction: column;
`
