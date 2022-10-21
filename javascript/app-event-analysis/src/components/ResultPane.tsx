/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link, Spinner, SpinnerSize, Stack, Text } from '@fluentui/react'
import { Hypothesis } from '@showwhy/app-common'
import { mean } from 'lodash'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Case, Switch } from 'react-if'
import { useRecoilState } from 'recoil'

import { useShowPlaceboGraphs } from '../hooks/useShowPlaceboGraphs.js'
import {
	ChartOptionsState,
	EventNameState,
	HypothesisState,
	OutcomeNameState,
	PlaceboSimulationState,
	SelectedTabKeyState,
	TreatedUnitsState,
	TreatmentStartDatesState,
	UnitsState,
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
import type { DimensionedLineChartProps } from './ResultPane.types.js'
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
	const [units] = useRecoilState(UnitsState)
	const showPlaceboGraphs = useShowPlaceboGraphs()

	const hoverInfo = useMemo(() => {
		return {
			hoverItem: hoverItem,
			setHoverItem: setHoverItem,
		} as HoverInfo
	}, [hoverItem, setHoverItem])

	const { renderRawData, showSynthControl, showChartPerUnit } = chartOptions

	const showRawDataLineChart = useMemo((): boolean => {
		return (
			renderRawData && selectedTabKey === CONFIGURATION_TABS.prepareAnalysis.key
		)
	}, [selectedTabKey, renderRawData])

	const showSyntheticComposition = useMemo((): boolean => {
		return (
			!isCalculatingEstimator &&
			outputData.length > 0 &&
			treatedUnits.length > 0 &&
			selectedTabKey === CONFIGURATION_TABS.estimateEffects.key
		)
	}, [isCalculatingEstimator, outputData, treatedUnits, selectedTabKey])

	const showPlaceboGraphsLocal = useMemo((): boolean => !isCalculatingEstimator && showPlaceboGraphs, [isCalculatingEstimator, showPlaceboGraphs])

	// barChartData is mainly used as a dependency to re-trigger the useDynamicChartDimensions hook
	//  when data changes
	// @REVIEW: is there a simpler way that involves removing this dependency
	const barChartRef = useRef<HTMLDivElement | null>(null)
	const placeboBarChartRef = useRef<HTMLDivElement | null>(null)
	const barChartHeightPercOfWinHeight = 0.35
	const barChartDimensions = useDynamicChartDimensions(
		barChartRef,
		barChartHeightPercOfWinHeight,
		synthControlData,
	)
	const placeboBarChartDimensions = useDynamicChartDimensions(
		placeboBarChartRef,
		barChartHeightPercOfWinHeight,
		placeboDataGroup,
	)
	const rawLineChartRef = useRef<HTMLDivElement | null>(null)
	const placeboLineChartRef = useRef<HTMLDivElement | null>(null)
	const synthLineChartRef = useRef<HTMLDivElement | null>(null)

	const getSdidEstimate = useCallback(
		(treatedUnit: string, output: PlaceboOutputData): number => {
			const index =
				output.output_lines_treated.findIndex(l =>
					l[0].unit.includes(treatedUnit),
				) ?? -1
			return index >= 0 ? output.sdid_estimates[index] : 0
		},
		[],
	)

	const getPlaceboBarChartInputData = useCallback(
		(
			placeboDataGroup: PlaceboDataGroup[],
			output?: PlaceboOutputData,
		): BarData[] => {
			const inputData = placeboDataGroup.map(placebo => {
				const sdidEstimate = output ? getSdidEstimate(placebo.unit, output) : 0
				const direction = sdidEstimate < 0 ? -1 : 1

				return {
					name: placebo.unit,
					value: placebo.frequency,
					label: placebo.ratio * direction,
					color: direction === 1 ? 'gray' : 'red',
				}
			})
			return inputData.sort((a, b) => b.label - a.label)
		},
		[hypothesis, getSdidEstimate],
	)

	const getTreatedPlaceboIndex = useCallback(
		(treatedUnit: string, placeboBarChartInputData: BarData[]): number => {
			return placeboBarChartInputData.findIndex(
				(placebo: BarData) => placebo.name === treatedUnit,
			)
		},
		[],
	)

	// TODO: Validate its use with Darren
	// const getPlaceboTreatedMSPERatio = useCallback(
	// 	(treatedUnit: string, placeboBarChartInputData: BarData[]) => {
	// 		const treatedPlaceboIndex = getTreatedPlaceboIndex(
	// 			treatedUnit,
	// 			placeboBarChartInputData,
	// 		)
	// 		const TOP_3_PLACEBOS = 3
	// 		// we assume that a treated placebo unit to have insignificant result
	// 		//  if either it was an extreme placebo and was filtered out or if it has a low ranker (below the top 3)
	// 		if (
	// 			treatedPlaceboIndex < 0 ||
	// 			treatedPlaceboIndex < placeboBarChartInputData.length - TOP_3_PLACEBOS
	// 		) {
	// 			return 0
	// 		}
	// 		return placeboBarChartInputData[treatedPlaceboIndex].label
	// 	},
	// 	[getTreatedPlaceboIndex],
	// )

	const getTreatedPlaceboP = useCallback(
		(treatedUnit: string, placeboBarChartInputData: BarData[]): number => {
			const treatedPlaceboIndex = getTreatedPlaceboIndex(
				treatedUnit,
				placeboBarChartInputData,
			)
			return parseFloat(
				((treatedPlaceboIndex + 1) / placeboBarChartInputData.length).toFixed(
					3,
				),
			)
		},
		[getTreatedPlaceboIndex],
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
					color: 'gray',
				}))
				.reverse()
		})
		return barChartData
	}, [synthControlData])

	const summaryResult = useMemo(() => {
		const outputDataNonPlacebo = outputData.filter(output =>
			treatedUnits.includes(output.treatedUnit),
		) as OutputData[]

		if (outputDataNonPlacebo.length === 0) return <></>
		// Note that all outputData entries will have the same treatment period because of
		//     how the backend enforces a consistent window to align all treatment periods
		//  This is the case if Staggered Design was not adopted
		const consistent_time_window =
			outputDataNonPlacebo[0].consistent_time_window
		let headerText =
			'The algorithm has selected ' +
			outputDataNonPlacebo[0].time_before_intervention.toString() +
			'-' +
			outputDataNonPlacebo[0].time_after_intervention.toString() +
			' as the time range for measuring effects.'
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
						Mean treatment effect across all treated units is{' '}
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
			lineChartRef: React.MutableRefObject<HTMLDivElement | null>,
			treatedUnitsList = treatedUnits,
		) => (
			<DimensionedLineChart
				inputData={inputData}
				lineChartRef={lineChartRef}
				checkableUnits={checkableUnits}
				onRemoveCheckedUnit={onRemoveCheckedUnit}
				output={output}
				treatedUnitsList={treatedUnitsList}
			/>
		),
		[inputData, checkableUnits, onRemoveCheckedUnit],
	)

	const syntheticControlComposition = useMemo(() => {
		const lineChart = getLineChart(outputData, synthLineChartRef)
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
						const lineChart = getLineChart(
							[filteredOutput],
							synthLineChartRef,
							[treatedUnit],
						)

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
								<Text variant="xLarge">{treatedUnit}</Text>
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
		checkableUnits,
		getLineChart,
		onRemoveCheckedUnit,
	])

	const rawDataLineChart = useMemo(() => {
		return getLineChart(outputData, rawLineChartRef)
	}, [outputData, getLineChart])

	const getPlaceboResults = useCallback(
		(
			treatedPlaceboP: number,
			causalEffect: number,
			treatedUnit: string,
		): string => {
			const p = 0.05
			const isSignificant = treatedPlaceboP <= p
			const isChangedHypothesis = hypothesis === Hypothesis.Change
			const isIncreasedHypothesis = hypothesis === Hypothesis.Increase
			const isDecreasedHypothesis = hypothesis === Hypothesis.Decrease
			const increasedHypothesisIsNotConsistent =
				isIncreasedHypothesis && causalEffect < 0
			const decreasedHypothesisIsNotConsistent =
				isDecreasedHypothesis && causalEffect >= 0
			const increasedHypothesisIsConsistent =
				isIncreasedHypothesis && causalEffect >= 0
			const decreasedHypothesisIsConsistent =
				isDecreasedHypothesis && causalEffect < 0
			const isHypothesisNotConsistent =
				increasedHypothesisIsNotConsistent || decreasedHypothesisIsNotConsistent
			const isHypothesisConsistent =
				isChangedHypothesis ||
				increasedHypothesisIsConsistent ||
				decreasedHypothesisIsConsistent

			if (isHypothesisNotConsistent) {
				return `no, the observed causal effect (${causalEffect}) for ${treatedUnit} is inconsistent with the hypothesis (it did not cause it to ${
					isIncreasedHypothesis ? 'increase' : 'decrease'
				})`
			}
			if (isHypothesisConsistent && !isSignificant) {
				return `no, the observed causal effect (${causalEffect}) for ${treatedUnit} is consistent with the hypothesis but the result is not statistically significant at the 5% level with respect to placebo effects (p=${treatedPlaceboP})`
			}
			if (isHypothesisConsistent && isSignificant) {
				return `yes, the observed causal effect (${causalEffect}) for ${treatedUnit} is consistent with the hypothesis and the result is statistically significant at the 5% level with respect to placebo effects (p=${treatedPlaceboP})`
			}
			return ''
		},
		[hypothesis],
	)

	const placeboGraphs = useMemo(() => {
		return treatedUnits.map((treatedUnit: string) => {
			const pdg = placeboDataGroup.get(treatedUnit)
			if (!pdg) return null
			const output = placeboOutputData.get(treatedUnit) as PlaceboOutputData[]
			const placeboBarChartInputData = getPlaceboBarChartInputData(
				pdg,
				output[0],
			)
			const sdidEstimate = output[0]
				? getSdidEstimate(treatedUnit, output[0])
				: 0
			const treatedPlaceboP = getTreatedPlaceboP(
				treatedUnit,
				placeboBarChartInputData,
			)
			const placeboResult = getPlaceboResults(
				treatedPlaceboP,
				sdidEstimate,
				treatedUnit,
			)
			const lineChart = getLineChart(output, placeboLineChartRef, [treatedUnit])
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
							The following visualization shows how the post-treatment
							divergence between the treated unit <b>{treatedUnit}</b> and its
							control group (highlighted) compares with the set of divergence
							scores calculated for each placebo unit. If the treatment was the
							true cause of the observed effect, we would expect actual treated
							units to have extreme divergence scores overall (following
							exclusion of units with poor control group fit).
						</Text>
					</Stack.Item>

					<Spacer axis="vertical" size={10} />

					<Stack.Item className={'no-top-margin'}>
						<div ref={placeboBarChartRef} className="chartContainer">
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
								/>
							</ErrorBoundary>
						</div>
					</Stack.Item>

					<Stack.Item className={'no-top-margin'}>
						{isValidUnit(treatedUnit) && placeboResult && (
							<Text className="infoText last-item-margin" variant="large">
								The answer to the overall question of:
								<Text variant="large" block>
									For treated {units}, did {eventName} cause {outcomeName} to{' '}
									{hypothesis}?
								</Text>
								Is therefore, {placeboResult}
								<Text variant="medium" block>
									<Link
										href="https://mixtape.scunning.com/10-synthetic_control#californias-proposition-99"
										target="_blank"
									>
										Learn more
									</Link>
								</Text>
							</Text>
						)}
					</Stack.Item>
				</>
			)
		})
	}, [
		hoverInfo,
		hypothesis,
		placeboBarChartRef,
		treatedUnits,
		placeboBarChartDimensions,
		checkableUnits,
		placeboDataGroup,
		placeboOutputData,
		getLineChart,
		onRemoveCheckedUnit,
		getPlaceboBarChartInputData,
		getPlaceboResults,
		getTreatedPlaceboP,
		getSdidEstimate,
	])

	const graphTitle = useMemo((): string => {
		if (showRawDataLineChart) {
			return 'Input Data'
		} else if (showPlaceboGraphsLocal) {
			return 'Placebo Analysis'
		} else if (showSynthControl) {
			return `Effect of ${eventName} on ${outcomeName}`
		}
		return ''
	}, [
		showRawDataLineChart,
		showPlaceboGraphsLocal,
		showSynthControl,
		eventName,
		outcomeName,
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
				{!isCalculatingEstimator && graphTitle && (
					<Text variant="xxLarge">{graphTitle}</Text>
				)}
			</Stack.Item>

			<Switch>
				<Case condition={showRawDataLineChart}>
					<Stack.Item>{rawDataLineChart}</Stack.Item>
				</Case>
				<Case condition={showSyntheticComposition}>
					<>
						<Stack.Item>{summaryResult}</Stack.Item>
						<Stack.Item>{syntheticControlComposition}</Stack.Item>
					</>
				</Case>
				<Case condition={showPlaceboGraphsLocal}>
					<>
						<Stack.Item>
							<Text className="infoText" variant="large">
								The following visualization shows the trajectory of each unit
								under the placebo assumption that it was treated in the
								specified period (with actual treated units highlighted). Note
								that each line shows the difference in outcomes between the
								labelled unit and its control group.
							</Text>
						</Stack.Item>
						{placeboGraphs}
					</>
				</Case>
			</Switch>
		</StyledStack>
	)
})

const DimensionedLineChart: React.FC<DimensionedLineChartProps> = memo(
	function DimensionedLineChart({
		inputData,
		lineChartRef = null,
		checkableUnits,
		onRemoveCheckedUnit,
		output,
		treatedUnitsList,
	}) {
		const [chartOptions] = useRecoilState(ChartOptionsState)
		const [hoverItem, setHoverItem] = useState<null | TooltipInfo>(null)
		const [treatedUnits] = useRecoilState(TreatedUnitsState)
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
			null,
		)
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
						treatedUnitsList={treatedUnitsList || treatedUnits}
					/>
				</ErrorBoundary>
			</div>
		)
	},
)
