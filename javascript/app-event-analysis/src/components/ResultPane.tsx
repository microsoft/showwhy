/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SpinnerSize, Stack, Text } from '@fluentui/react'
import { Hypothesis } from '@showwhy/app-common'
import { useThematic } from '@thematic/react'
import { mean } from 'lodash'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useRecoilState } from 'recoil'

import {
	ChartOptionsState,
	EventNameState,
	HypothesisState,
	OutcomeNameState,
	PlaceboSimulationState,
	SelectedTabKeyState,
	TreatedUnitsState,
	TreatmentStartDatesState,
} from '../state/state.js'
import type {
	BarData,
	HoverInfo,
	OutputData,
	PlaceboDataGroup,
	PlaceboOutputData,
	ResultPaneProps,
	TooltipInfo,
} from '../types.js'
import {
	BarChartOrientation,
	CONFIGURATION_TABS,
	TimeAlignmentOptions,
} from '../types.js'
import { getKeyByValue, weightedMean } from '../utils/misc.js'
import { isValidUnit } from '../utils/validation.js'
import { BarChart } from './BarChart.js'
import { CustomMessageBar } from './CustomMessageBar.js'
import { LineChart } from './LineChart.js'
import { useDynamicChartDimensions } from './ResultPane.hooks.js'
import { StyledStack } from './ResultPane.styles.js'
import Spacer from './style/Spacer.js'

const ChartErrorFallback: React.FC<{ error: Error }> = memo(
	function ChartErrorFallback({ error }) {
		return (
			<div role="alert">
				<p>Something went wrong rendering the chart:</p>
				<pre>{error.message}</pre>
			</div>
		)
	},
)

export const ResultPane: React.FC<ResultPaneProps> = memo(function ResultPane({
	inputData,
	outputData,
	synthControlData,
	statusMessage,
	isCalculatingEstimator,
	placeboDataGroup,
	placeboOutputData,
	timeAlignment,
	checkableUnits,
	onRemoveCheckedUnit,
}) {
	const theme = useThematic()
	// Calls to setHoverItem is batched by default when updating the state
	// d3 mouse move/leave events are emitted too quickly sometimes causing the batching of state update
	// to skip clearing existing hover before applying a new, different, hover
	// ReactDOM.flushSync is used to prevent batching the state update
	// so that each hover on mouse-move is guaranteed to be followed by another hover update on mouse-leave
	const [hoverItem, setHoverItem] = useState<null | TooltipInfo>(null)

	const [eventName] = useRecoilState(EventNameState)
	const [chartOptions] = useRecoilState(ChartOptionsState)
	const [outcomeName] = useRecoilState(OutcomeNameState)
	const [treatedUnits] = useRecoilState(TreatedUnitsState)
	const [treatmentStartDates] = useRecoilState(TreatmentStartDatesState)
	const [isPlaceboSimulation] = useRecoilState(PlaceboSimulationState)
	const [selectedTabKey] = useRecoilState(SelectedTabKeyState)
	const [hypothesis] = useRecoilState(HypothesisState)

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
		showChartPerUnit,
	} = chartOptions

	const showRawDataLineChart = useMemo((): boolean => {
		return (
			!isCalculatingEstimator &&
			renderRawData &&
			selectedTabKey === CONFIGURATION_TABS.prepareAnalysis.key
		)
	}, [selectedTabKey, renderRawData, isCalculatingEstimator])

	// barChartData is mainly used as a dependency to re-trigger the useDynamicChartDimensions hook
	//  when data changes
	// @REVIEW: is there a simpler way that involves removing this dependency
	const barChartData = useMemo(() => {
		return isPlaceboSimulation ? placeboDataGroup : synthControlData
	}, [placeboDataGroup, synthControlData, isPlaceboSimulation])
	const lineChartRef = useRef<HTMLDivElement | null>(null)
	const lineChartHeightPercOfWinHeight = 0.35
	const lineChartDimensions = useDynamicChartDimensions(
		lineChartRef,
		lineChartHeightPercOfWinHeight,
		null,
	)

	const barChartRef = useRef<HTMLDivElement | null>(null)
	const barChartHeightPercOfWinHeight = 0.35
	const barChartDimensions = useDynamicChartDimensions(
		barChartRef,
		barChartHeightPercOfWinHeight,
		barChartData,
	)

	const getPlaceboBarChartInputData = useCallback(
		(placeboDataGroup: PlaceboDataGroup[], output?: PlaceboOutputData) => {
			const inputData = placeboDataGroup.map(placebo => {
				let direction = 1
				if (output && hypothesis !== Hypothesis.Change) {
					const index =
						output.output_lines_treated.findIndex(
							l => l[0].unit === placebo.unit,
						) || -1
					const sdidEstimate = index >= 0 ? output.sdid_estimates[index] : 0
					direction = sdidEstimate < 0 ? -1 : 1
				}

				return {
					name: placebo.unit,
					value: placebo.frequency * direction,
					label: placebo.ratio * direction,
					color: theme.process().fill().hex(),
				}
			})
			return inputData.sort((a, b) => a.value - b.value)
		},
		[theme, hypothesis],
	)

	const getPlaceboTreatedMSPERatio = useCallback(
		(treatedUnit: string, placeboDataGroup: PlaceboDataGroup[]) => {
			const placeboBarChartInputData =
				getPlaceboBarChartInputData(placeboDataGroup)
			const treatedPlaceboIndex = placeboBarChartInputData.findIndex(
				placebo => placebo.name === treatedUnit, // NOTE: isPlaceboSimulation will only be true when we have a single treated unit
			)
			const TOP_3_PLACEBOS = 3
			// we assume that a treated placebo unit to have insignificant result
			//  if either it was an extreme placebo and was filtered out or if it has a low ranker (below the top 3)
			if (
				treatedPlaceboIndex < 0 ||
				treatedPlaceboIndex < placeboBarChartInputData.length - TOP_3_PLACEBOS
			) {
				return 0
			}
			return placeboBarChartInputData[treatedPlaceboIndex].label
		},
		[getPlaceboBarChartInputData],
	)

	// Try to remember (and add a comment) why create a derived memoized value
	//  while you could just pass the derived value directly into the child-component's prop
	const synthControlBarChartData = useMemo(() => {
		const barChartData: { [treatedUnitKey: string]: BarData[] } = {}
		Object.keys(synthControlData).forEach(treatedUnitKey => {
			barChartData[treatedUnitKey] = synthControlData[treatedUnitKey]
				.map(weightedUnit => ({
					name: weightedUnit.unit,
					value: weightedUnit.weight,
					color: theme.process().fill().hex(),
				}))
				.reverse()
		})
		return barChartData
	}, [theme, synthControlData])

	const summaryResult = useMemo(() => {
		const outputDataNonPlacebo = outputData.filter(output =>
			treatedUnits.includes(output.treatedUnit),
		) as OutputData[]

		if (
			isCalculatingEstimator ||
			isPlaceboSimulation ||
			outputData.length === 0 ||
			treatedUnits.length === 0 ||
			outputDataNonPlacebo.length === 0
		)
			return <></>
		// Note that all outputData entries will have the same treatment period because of
		//     how the backend enforces a consistent window to align all treatment periods
		//  This is the case if Staggered Design was not adopted
		const consistent_time_window =
			outputDataNonPlacebo[0].consistent_time_window
		let headerText =
			'Algorithm has selected ' +
			outputDataNonPlacebo[0].time_before_intervention.toString() +
			'-' +
			outputDataNonPlacebo[0].time_after_intervention.toString() +
			' as the time range for measuring effects'
		if (
			treatedUnits.length > 1 &&
			timeAlignment === getKeyByValue(TimeAlignmentOptions.Staggered_Design)
		) {
			headerText =
				'The algorithm has selected a different time range according to the treatment period of each unit to measure the effect'
		}
		const header = (
			<Text className="infoText bottom-gap" variant="large">
				{headerText}
				<br />
			</Text>
		)
		// mean treatment effect is a weighted average of individual treatment effects
		//  with equal weights if time alignment is applied to data during the estimate calculation
		// However, when staggered design is adopted, time alignment is not applied
		//  (i.e., no consistent time window is used for all treated units),
		//  and thus a different weight is calculated for each unit before applying the weighted average
		//  Such weights are calculated based on the number of post-treatment periods for each unit
		let meanTreatmentEffect = ''
		if (
			timeAlignment !== getKeyByValue(TimeAlignmentOptions.Staggered_Design)
		) {
			meanTreatmentEffect = mean(
				outputDataNonPlacebo.map(output => output.sdid_estimate),
			).toFixed(2)
		} else {
			const treatmentEndDate = inputData.endDate
			const treatmentDateOffsets: number[] = []
			const weights: number[] = []
			treatmentStartDates.forEach((treatmentDate: number) => {
				const diff = treatmentEndDate - treatmentDate
				treatmentDateOffsets.push(diff)
			})
			const totalTreatmentDatesForAllUnits = treatmentDateOffsets.reduce(
				(a, b) => a + b,
				0,
			)
			treatmentDateOffsets.forEach(treatmentDateOffset => {
				weights.push(treatmentDateOffset / totalTreatmentDatesForAllUnits)
			})
			meanTreatmentEffect = weightedMean(
				outputDataNonPlacebo.map(output => output.sdid_estimate),
				weights,
			)
				.toFixed(2)
				.toString()
		}
		const footer =
			outputDataNonPlacebo.length === 1 ? (
				<></>
			) : (
				<Text className="infoText" variant="large">
					<b>
						Mean treatment effect across all treated units is:{' '}
						{meanTreatmentEffect}
					</b>
					<br />
				</Text>
			)
		return (
			<Stack>
				<Stack.Item>
					{consistent_time_window &&
						timeAlignment ===
							getKeyByValue(TimeAlignmentOptions.Fixed_No_Overlap) && (
							<Text
								className="infoText italic light bottom-gap"
								variant="large"
							>
								NOTE: Pre-treatment period for all units is before the
								first-treated unit and post-treatment is after the last-treated
								unit.
								<br />
							</Text>
						)}
				</Stack.Item>
				<Stack.Item>
					{consistent_time_window &&
						timeAlignment ===
							getKeyByValue(TimeAlignmentOptions.Shift_And_Align_Units) && (
							<Text
								className="infoText italic light bottom-gap"
								variant="large"
							>
								NOTE: Units with different treatment times have been aligned at
								time step {consistent_time_window[0]} (&quot;T&quot;).
								<br />
							</Text>
						)}
				</Stack.Item>
				<Stack.Item>{header}</Stack.Item>
				<Stack.Item>{footer}</Stack.Item>

				<Stack.Item className="summary-list">
					{outputDataNonPlacebo.map(output => (
						<Text key={output.treatedUnit} className="infoText" variant="large">
							{'Treatment effect in '}
							{output.treatedUnit} {' is: '}
							<b className={output.sdid_estimate < 0 ? 'negative' : 'positive'}>
								{output.sdid_estimate}
							</b>
							<br />
						</Text>
					))}
				</Stack.Item>
			</Stack>
		)
	}, [treatedUnits, outputData, isCalculatingEstimator, isPlaceboSimulation]) // timeAlignment used but not needed as a dependency!

	const getLineChart = useCallback(
		(
			output: (OutputData | PlaceboOutputData)[],
			treatedUnitsList = treatedUnits,
		) => {
			return (
				<div ref={lineChartRef} className="chartContainer">
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
							treatedUnitsList={treatedUnitsList}
						/>
					</ErrorBoundary>
				</div>
			)
		},
		[
			treatedUnits,
			lineChartRef,
			ChartErrorFallback,
			inputData,
			showSynthControl,
			showGrid,
			applyIntercept,
			relativeIntercept,
			renderRawData,
			showTreatmentStart,
			lineChartDimensions,
			hoverInfo,
			showMeanTreatmentEffect,
			checkableUnits,
			onRemoveCheckedUnit,
		],
	)

	const syntheticControlComposition = useMemo(() => {
		if (
			isCalculatingEstimator ||
			isPlaceboSimulation ||
			outputData.length === 0 ||
			treatedUnits.length === 0
		)
			return <></>
		const lineChart = getLineChart(outputData)
		return (
			<>
				{!showChartPerUnit && lineChart}
				{treatedUnits
					.filter(unit => synthControlData[unit] !== undefined)
					.map(treatedUnit => {
						const output =
							outputData.find(o => o.treatedUnit === treatedUnit) ||
							({} as OutputData)

						const filteredOutput = {
							...output,
							output_lines_control: output.output_lines_control.filter(l =>
								l[0].unit.includes(treatedUnit),
							),
							output_lines_treated: output.output_lines_treated.filter(l =>
								l[0].unit.includes(treatedUnit),
							),
						}
						const lineChart = getLineChart([filteredOutput], [treatedUnit])

						const header = (
							<Text
								className="infoText synth-control-text-margin"
								variant="large"
							>
								This outcome was calculated by comparing the actual{' '}
								<b>{outcomeName}</b> data from <b>{treatedUnit}</b> with a
								control group composed of weighted combinations of the following{' '}
								<b>
									{synthControlData[treatedUnit].length} {'units'},
								</b>{' '}
								intended to closely match the expected trajectory of{' '}
								<b>{treatedUnit}</b> without <b>{eventName}.</b>
							</Text>
						)

						const syntheticControlBarChart = (
							<div ref={barChartRef} className="chartContainer">
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
									/>
								</ErrorBoundary>
							</div>
						)
						return (
							<Stack key={treatedUnit} tokens={{ padding: 10 }}>
								<Text variant="xxLarge">{treatedUnit}</Text>
								<Spacer axis="vertical" size={10} />
								{showChartPerUnit && lineChart}
								{header}
								{syntheticControlBarChart}
							</Stack>
						)
					})}
			</>
		)
	}, [
		isCalculatingEstimator,
		isPlaceboSimulation,
		outputData,
		outcomeName,
		treatedUnits,
		synthControlData,
		eventName,
		barChartRef,
		barChartDimensions,
		hoverInfo,
		synthControlBarChartData,
		showChartPerUnit,
	])

	const renderForPlacebo = useMemo(() => {
		return (
			!isCalculatingEstimator &&
			isPlaceboSimulation &&
			placeboDataGroup.size > 0
		)
	}, [isCalculatingEstimator, isPlaceboSimulation, placeboDataGroup])

	const rawDataLineChart = useMemo(() => {
		return getLineChart(outputData)
	}, [outputData, getLineChart])

	const placeboGraphs = useMemo(() => {
		if (!renderForPlacebo) return null
		return treatedUnits.map((treatedUnit: string) => {
			const pdg = placeboDataGroup.get(treatedUnit)
			if (!pdg) return null
			const output = placeboOutputData.get(treatedUnit) as PlaceboOutputData[]
			const placeboBarChartInputData = getPlaceboBarChartInputData(
				pdg,
				output[0],
			)
			const placeboTreatedMSPERatio = getPlaceboTreatedMSPERatio(
				treatedUnit,
				pdg,
			)
			const lineChart = getLineChart(output, [treatedUnit])
			return (
				<>
					<Stack.Item>
						<Text variant="xxLarge">{treatedUnit}</Text>
					</Stack.Item>

					<Spacer axis="vertical" size={15} />

					<Stack.Item>{lineChart}</Stack.Item>

					<Spacer axis="vertical" size={15} />

					<Stack.Item className={'no-top-margin'}>
						<Text className="infoText" variant="large">
							The following visualization is used to evaluate{' '}
							{isValidUnit(treatedUnit) ? ' the ' : ' each unit '}
							<b>{treatedUnit}</b> gap relative to the gaps obtained from the
							placebo runs by looking at the distribution of the Root Mean
							Square Prediction Error ratios for all placebo units (with the
							originally treated unit highlighted and with the exclusion of
							extreme placebos)
						</Text>
					</Stack.Item>

					<Stack.Item className={'no-top-margin'}>
						<div ref={barChartRef} className="chartContainer">
							<ErrorBoundary FallbackComponent={ChartErrorFallback}>
								<BarChart
									inputData={placeboBarChartInputData}
									dimensions={barChartDimensions}
									orientation={BarChartOrientation[BarChartOrientation.column]}
									hoverInfo={hoverInfo}
									leftAxisLabel={'Ratio'}
									bottomAxisLabel={''}
									checkableUnits={checkableUnits}
									onRemoveCheckedUnit={onRemoveCheckedUnit}
									refLine={hypothesis !== Hypothesis.Change}
								/>
							</ErrorBoundary>
						</div>
					</Stack.Item>

					<Stack.Item className={'no-top-margin'}>
						{isValidUnit(treatedUnit) && (
							<Text className="infoText last-item-margin" variant="large">
								<b>{treatedUnit}</b>
								{placeboTreatedMSPERatio > 0
									? ` stands out with an extreme ratio (top 3 post MSPE ${Math.trunc(
											placeboTreatedMSPERatio,
									  )} times the pre MSPE), so one may conclude the significance of results`
									: ' seems to have a small ratio, so one may conclude the insignificance of results'}
							</Text>
						)}
					</Stack.Item>
				</>
			)
		})
	}, [
		hoverInfo,
		hypothesis,
		barChartRef,
		treatedUnits,
		renderForPlacebo,
		barChartDimensions,
		checkableUnits,
		placeboDataGroup,
		placeboOutputData,
		getLineChart,
		onRemoveCheckedUnit,
		getPlaceboBarChartInputData,
		getPlaceboTreatedMSPERatio,
	])

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
				{!isCalculatingEstimator && eventName && (
					<Text variant="xxLarge">
						{renderRawData
							? `${eventName}'s Raw Data:`
							: `Effect of ${eventName} on ${outcomeName}`}
					</Text>
				)}
			</Stack.Item>

			{!renderRawData && <Stack.Item>{summaryResult}</Stack.Item>}

			<Stack.Item>
				{renderForPlacebo && !renderRawData && (
					<Text className="infoText" variant="large">
						The following is the sweep visualization reflecting the trajectory
						of each Unit under the placebo assumption that it was treated in the
						specified period (with the originally treated unit highlighted).
						Note that each placebo line is rendered with the relative intercept.
					</Text>
				)}
			</Stack.Item>

			<Stack.Item>{showRawDataLineChart && rawDataLineChart}</Stack.Item>

			{!renderRawData && (
				<>
					<Stack.Item className={isPlaceboSimulation ? 'no-top-margin' : ''}>
						{syntheticControlComposition}
					</Stack.Item>

					{placeboGraphs}
				</>
			)}
		</StyledStack>
	)
})
