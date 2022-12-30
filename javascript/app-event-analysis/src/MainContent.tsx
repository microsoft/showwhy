/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Label,
	MessageBarType,
	Pivot,
	PivotItem,
	PrimaryButton,
	Spinner,
	SpinnerSize,
	Stack,
	Text,
} from '@fluentui/react'
import { cloneDeep, isEmpty } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import API from './api.js'
import { EffectResultPane } from './components/EffectResultPane/index.js'
import { PlaceboResultPane } from './components/PlaceboResultPane/index.js'
import { RawDataPane } from './components/RawDataPane.js'
import { usePlaceboDataGroup } from './hooks/usePlaceboDataGroup.js'
import { usePlaceboOutputData } from './hooks/usePlaceboOutputData.js'
import { useProcessedInputData } from './hooks/useProcessedInputData.js'
import { useShowPlaceboGraphs } from './hooks/useShowPlaceboGraphs.js'
import { useTreatedUnitsMap } from './hooks/useTreatedUnitsMap.js'
import {
	RightPanelHeader,
	StyledStack,
	Title,
	usePivotStyles,
} from './MainContent.styles.js'
import { processSynthControlData } from './MainContent.utils.js'
import { EstimateEffects } from './pages/EstimateEffects/index.js'
import { PrepareAnalysis } from './pages/PrepareAnalysis/index.js'
import {
	useChartOptionsState,
	useCheckedUnitsState,
	useColumnMappingState,
	useEstimatorState,
	useEventNameState,
	useHypothesisState,
	useOutcomeNameState,
	useOutputResState,
	usePlaceboOutputResResetState,
	usePlaceboSimulationState,
	useSelectedTabKeyState,
	useSetPlaceboOutputResState,
	useSetTreatmentStartDatesAfterEstimateState,
	useTimeAlignmentState,
	useTreatedUnitsState,
	useTreatmentStartDatesState,
	useUnitsState,
} from './state/index.js'
import type {
	MessageBarProps,
	OutputData,
	PlaceboOutputData,
	SDIDOutputResponse,
} from './types.js'
import { CONFIGURATION_TABS, POSSIBLE_COL_NAMES } from './types.js'
import { processOutputData } from './utils/processOutputData.js'
import { isValidTreatmentDate, isValidUnit } from './utils/validation.js'

export const MainContent: React.FC = memo(function MainContent() {
	// Column mapping
	const [columnMapping] = useColumnMappingState()

	// Processed Data
	const { data, isDataLoaded, defaultTreatment } =
		useProcessedInputData(columnMapping)

	// Display Names
	const [outcomeName] = useOutcomeNameState()
	const [eventName] = useEventNameState()

	// Treatment setting
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()
	const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()

	// Chart Options
	const [chartOptions, setChartOptions] = useChartOptionsState()

	const [estimator] = useEstimatorState()

	const [selectedTabKey, setSelectedTabKey] = useSelectedTabKeyState()

	const [timeAlignment] = useTimeAlignmentState()

	const [units] = useUnitsState()
	const [hypothesis] = useHypothesisState()

	// Raw output data
	const [outputRes, setOutputRes] = useOutputResState()

	const setPlaceboOutputRes = useSetPlaceboOutputResState()
	const resetPlaceboOutputRes = usePlaceboOutputResResetState()

	// encapsulate the value of treatment-start-date in certain occasions only
	//  e.g., after session data is loaded and after an estimator is executed
	const setTreatmentStartDatesAfterEstimate =
		useSetTreatmentStartDatesAfterEstimateState()

	const [userMessage, setUserMessage] = useState<MessageBarProps>({
		isVisible: false,
		content: '',
	})

	// Loading state
	const [isCalculatingEstimator, setCalculatingEstimator] = useState(false)
	const [isPlaceboSimulation, setPlaceboSimulation] =
		usePlaceboSimulationState()
	const { renderRawData } = chartOptions

	const showPlaceboGraphs = useShowPlaceboGraphs()
	const showRawDataLineChart = useMemo<boolean>(() => {
		return (
			renderRawData && selectedTabKey === CONFIGURATION_TABS.prepareAnalysis.key
		)
	}, [selectedTabKey, renderRawData])

	const isInitialRender = useRef(true)

	// hacks to speed up computation:
	// cache treated units and selected units as maps
	const treatedUnitsMap = useTreatedUnitsMap()

	const unitCheckboxListItems = useMemo(
		() =>
			data.uniqueUnits
				.filter((unit: string) => !treatedUnitsMap[unit])
				.map((unit: string) => ({ name: unit })),
		[data.uniqueUnits, treatedUnitsMap],
	)

	// const exportFileName = `${eventName} on ${outcomeName}.sdid.json`.replaceAll(
	// 	' ',
	// 	'_',
	// )

	const outputData: (OutputData | PlaceboOutputData)[] = useMemo(
		() => processOutputData(outputRes, treatedUnitsMap),
		[outputRes, treatedUnitsMap],
	)

	const placeboOutputData = usePlaceboOutputData()

	const synthControlData = useMemo(
		() => processSynthControlData(outputData, checkedUnits),
		[outputData, checkedUnits],
	)

	const placeboDataGroup = usePlaceboDataGroup()

	useEffect(() => {
		// initially, all units are checked
		if (checkedUnits === null && data.uniqueUnits.length) {
			setCheckedUnits(new Set(data.uniqueUnits))
		}
	}, [data, checkedUnits, setCheckedUnits])

	useEffect(() => {
		if (
			defaultTreatment !== null &&
			(isEmpty(treatedUnits) ||
				isEmpty(treatmentStartDates) ||
				!isInitialRender.current)
		) {
			setTreatmentStartDates(defaultTreatment.startDates)
			setTreatedUnits(defaultTreatment.units)
		}
		isInitialRender.current = false
	}, [defaultTreatment])

	//
	// computed validation checks
	//
	const validInput = useMemo(() => {
		return !isEmpty(data.dataPoints) || !data.isBalancedPanelData
	}, [data])

	const validColumnsMapping = useMemo(() => {
		let valid = true
		Object.keys(POSSIBLE_COL_NAMES).forEach(colName => {
			if (colName !== 'treated' && columnMapping[colName] === '') {
				valid = false
				return
			}
		})
		return valid
	}, [columnMapping])

	const validTreatedUnits = useMemo(() => {
		return (
			treatedUnits.length > 0 && treatedUnits.every(unit => isValidUnit(unit))
		)
	}, [treatedUnits])
	const validTreatmentDates = useMemo(() => {
		return (
			treatmentStartDates.length > 0 &&
			treatmentStartDates.every(isValidTreatmentDate)
		)
	}, [treatmentStartDates])

	// synthdid requires at least two time steps for the pre-treatment periods
	// see https://github.com/synth-inference/synthdid/issues/78
	const validPreTreatmentPeriods = useMemo(() => {
		const isPreValidTreatmentDate = (treatmentDate: number) => {
			return treatmentDate - data.startDate >= 2
		}
		return (
			validTreatmentDates && treatmentStartDates.every(isPreValidTreatmentDate)
		)
	}, [validTreatmentDates, treatmentStartDates, data])

	// check for invalid column mapping
	//  (except for the treated column
	//   which may not be assigned but alternatively configured
	//   through explicit assignment of the treated-unit and the treatment-start-date)
	const cannotCalculateEstimate = useMemo(() => {
		let invalid = false
		// for the treated configuration,
		//  ensure that treatedUnits and treatmentStartDates are valid
		//  (note that unit-based placebo does not require a valid treatment date)
		// also, check that the input data is valid
		if (
			!validInput ||
			!validTreatmentDates ||
			!validTreatedUnits ||
			!validColumnsMapping
		) {
			invalid = true
		}
		return invalid || isCalculatingEstimator
	}, [
		isCalculatingEstimator,
		validInput,
		validTreatmentDates,
		validTreatedUnits,
		validColumnsMapping,
	])

	const cannotCalculatePlacebo = useMemo(() => {
		let invalid = false
		// for the treated configuration,
		//  ensure that treatmentStartDates are valid
		//  (note that varying-unit placebo does not require a valid treated unit)
		// also, check that the input data is valid
		if (!validInput || !validTreatmentDates || !validColumnsMapping) {
			invalid = true
		}
		return invalid || isCalculatingEstimator
	}, [
		isCalculatingEstimator,
		validInput,
		validColumnsMapping,
		validTreatmentDates,
	])

	const checkCanExecuteEstimator = useCallback(() => {
		if (
			(cannotCalculateEstimate && cannotCalculatePlacebo) ||
			!validPreTreatmentPeriods
		) {
			const getMessage = () => {
				if (!isDataLoaded)
					return 'No data is loaded yet. Please load a valid dataset first!'
				if (!data.isBalancedPanelData)
					return 'Data is not in a balanced panel format. Please ensure that each unit has observations for ALL time periods!'
				if (!validColumnsMapping || !validInput)
					return 'Please ensure that Unit, Date, and Outcome have valid selections!'
				if (!validTreatedUnits)
					return 'Please ensure that at least one treated unit is selected'
				if (!validTreatmentDates)
					return 'Please ensure that at least one treatment period is selected'
				if (!validPreTreatmentPeriods)
					return 'Please ensure that pre-treatment periods for each treatment date has at least two time steps'
				return 'Unknown Error'
			}
			setUserMessage({
				isVisible: true,
				content: getMessage(),
				type: MessageBarType.error,
			})
			return false
		}
		return true
	}, [
		cannotCalculateEstimate,
		cannotCalculatePlacebo,
		isDataLoaded,
		data,
		validColumnsMapping,
		validInput,
		validTreatedUnits,
		validTreatmentDates,
		validPreTreatmentPeriods,
	])

	async function runPlaceboUnitComparison() {
		resetPlaceboOutputRes()
		for (const treatedUnit of treatedUnits) {
			await calculateEstimate(true, [treatedUnit])
		}
	}

	//
	// To evaluate the significance of our estimates, we pose the
	//  question of whether our results could be driven entirely by chance.
	//  How often would we obtain results of this magnitude if we had
	//  chosen a unit at random for the study instead of the treated unit (e.g., California)?
	//  To answer this question, we use placebo tests
	//
	const calculateEstimate = async (
		placebo = false,
		treatedUnitsList: string[] = treatedUnits,
	) => {
		// NOTE that a long running placebo can force the user to wait a long time
		//  alternatively, a task queue mechanism can be used on the backend to schedule
		//  long-running tasks on the background and let the frontend poll for the result as needed
		//  See Celery as an example: https://testdriven.io/courses/fastapi-celery/intro/

		if (!checkCanExecuteEstimator()) return

		setUserMessage({
			isVisible: true,
			content: 'Calculating...',
			type: MessageBarType.info,
		})

		setPlaceboSimulation(placebo)
		setCalculatingEstimator(true)

		// filter input data according to unit selection, and include the treated units
		let filteredInputData = data.dataPoints
			.filter(
				dp =>
					(checkedUnits && checkedUnits.has(dp.unit)) ||
					treatedUnitsMap[dp.unit],
			)
			.map(({ unit, date, value, treated }) => {
				// Make sure data point only includes value, date, unit, treated field
				return { unit, date, value, treated }
			})

		if (placebo) {
			filteredInputData = filteredInputData.filter(
				i => i.unit === treatedUnitsList[0] || !treatedUnits.includes(i.unit),
			)
		}

		// basically any changes to units/dates is considered placebo (i.e., what-if simulation)
		// except when only excluding some of the units from the input data

		// @TEMP use the following to switch the backend lib that is used
		//       for calculating the estimate
		const queryParams = new URLSearchParams(window.location.search)
		const lib = queryParams.get('lib')

		let calculationError: Error | null = null
		const res = await API.post<SDIDOutputResponse>('/', {
			input_data: filteredInputData,
			estimator: estimator.toLowerCase(),
			time_alignment: timeAlignment.toLowerCase(),
			treatment_start_dates: treatmentStartDates,
			compute_placebos: placebo,
			treated_units: treatedUnitsList,
			lib: lib === 'pysynthdid' ? lib : 'synthdid',
		}).catch((error: Error) => {
			calculationError = error
		})

		setCalculatingEstimator(false)

		// result will always come back as an array
		const outputsResponse: SDIDOutputResponse | null =
			calculationError === null && res ? res.data : null
		const outputs =
			outputsResponse?.outputs.map(outputResult => outputResult.output) ?? []
		if (outputs.every(output => isEmpty(output))) {
			let errorMsg = 'Error calculating output for the provided input!'
			if (calculationError !== null)
				errorMsg += '\n' + (calculationError as Error).message
			setUserMessage({
				isVisible: true,
				content: errorMsg,
				type: MessageBarType.error,
			})
			setOutputRes(null)
			resetPlaceboOutputRes()
			return
		}
		setUserMessage({
			isVisible: false,
			content: '',
		})
		if (placebo) {
			setPlaceboOutputRes(prev => {
				const res = cloneDeep(prev)
				res[treatedUnitsList[0]] = outputsResponse
				return res
			})
		} else {
			setOutputRes(outputsResponse)
		}
		setTreatmentStartDatesAfterEstimate({ tStartDates: treatmentStartDates })
		// after the method calculated the results,
		//  automatically un-toggle the raw input and show the synth control
		setChartOptions({
			...chartOptions,
			renderRawData: false,
			showSynthControl: true,
		})
	}

	const onHandleTabClicked = useCallback(
		(itemClicked?: PivotItem) => {
			const itemKey = itemClicked?.props.itemKey
				? itemClicked.props.itemKey
				: ''
			setSelectedTabKey(itemKey)
		},
		[setSelectedTabKey],
	)

	const handleRemoveCheckedUnit = useCallback(
		(unitToRemove: string) => {
			const checkedUnitsCopy = new Set(checkedUnits)
			checkedUnitsCopy?.delete(unitToRemove)
			setCheckedUnits(checkedUnitsCopy)
		},
		[checkedUnits, setCheckedUnits],
	)

	useEffect(() => {
		setChartOptions(prev => ({
			...prev,
			renderRawData: selectedTabKey === CONFIGURATION_TABS.prepareAnalysis.key,
		}))
	}, [selectedTabKey])
	const pivotStyles = usePivotStyles()
	return (
		<StyledStack grow horizontal verticalFill className="synthdid-container">
			<Stack.Item>
				<Stack tokens={{ childrenGap: 8 }} className="leftPanel">
					<Pivot
						aria-label="SynthDiD Navigation Tabs"
						className="tabControl"
						onLinkClick={onHandleTabClicked}
						selectedKey={selectedTabKey}
						styles={pivotStyles}
					>
						<PivotItem
							headerText={CONFIGURATION_TABS.prepareAnalysis.label}
							itemKey={CONFIGURATION_TABS.prepareAnalysis.key}
						>
							<PrepareAnalysis />
						</PivotItem>
						<PivotItem
							headerText={CONFIGURATION_TABS.estimateEffects.label}
							itemKey={CONFIGURATION_TABS.estimateEffects.key}
						>
							<EstimateEffects />
						</PivotItem>
						<PivotItem
							headerText={CONFIGURATION_TABS.validateEffects.label}
							itemKey={CONFIGURATION_TABS.validateEffects.key}
						>
							<Stack tokens={{ childrenGap: 5 }}>
								<Label className="stepText">Run placebo simulation</Label>
								<Text className="stepDesc">
									Compare treated effects to placebo effects of untreated units.
								</Text>

								<Stack horizontal grow tokens={{ childrenGap: 5 }}>
									<PrimaryButton
										disabled={cannotCalculatePlacebo}
										text="Run placebo unit comparison"
										onClick={() => void runPlaceboUnitComparison()}
									/>
									{isCalculatingEstimator && isPlaceboSimulation && (
										<Spinner size={SpinnerSize.medium} />
									)}
								</Stack>
							</Stack>
						</PivotItem>
					</Pivot>
				</Stack>
			</Stack.Item>

			<Stack.Item grow className="rightPanel">
				{/* TODO: Move out header */}
				<RightPanelHeader>
					<Stack tokens={{ childrenGap: 5 }}>
						<Title>
							For treated {units || '<units>'}, did {eventName || '<event>'}{' '}
							cause {outcomeName || '<outcome>'} to{' '}
							{hypothesis?.toLowerCase() || '<hypothesis>'}?
						</Title>
					</Stack>
				</RightPanelHeader>
				{showRawDataLineChart && (
					<RawDataPane
						inputData={data}
						outputData={outputData}
						statusMessage={userMessage}
						checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				)}
				{selectedTabKey === CONFIGURATION_TABS.estimateEffects.key && (
					<EffectResultPane
						inputData={data}
						outputData={outputData}
						synthControlData={synthControlData}
						statusMessage={userMessage}
						isLoading={isCalculatingEstimator}
						timeAlignment={timeAlignment}
						checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				)}
				{showPlaceboGraphs && (
					<PlaceboResultPane
						inputData={data}
						statusMessage={userMessage}
						isCalculatingEstimator={isCalculatingEstimator}
						placeboDataGroup={placeboDataGroup}
						placeboOutputData={placeboOutputData}
						checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				)}
			</Stack.Item>
		</StyledStack>
	)
})
