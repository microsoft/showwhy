/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Hypothesis } from '@showwhy/app-common';
import { HypothesisGroup, MenuBar, useDataTables } from '@showwhy/app-common'
import type { IDropdownOption, ITooltipHostStyles } from '@fluentui/react'
import {
	ActionButton,
	Checkbox,
	DefaultButton,
	Dropdown,
	FontIcon,
	Label,
	Link,
	MessageBarType,
	Pivot,
	PivotItem,
	PrimaryButton,
	Spinner,
	SpinnerSize,
	Stack,
	Text,
	TextField,
	TooltipHost,
} from '@fluentui/react'
import { not } from 'arquero'
import { clone, cloneDeep, isEmpty, isEqual, uniq } from 'lodash'
import type { FormEvent } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import API from '../api.js'
import { useProcessedInputData } from '../hooks/useProcessedInputData.js'
import {
	AggregateEnabledState,
	AggTreatmentState,
	ChartOptionsState,
	CheckedUnitsState,
	ColumnMappingState,
	EstimatorState,
	EventNameState,
	FileNameState,
	FilterState,
	HypothesisState,
	OutcomeNameState,
	OutputResState,
	PlaceboOutputResState,
	PlaceboSimulationState,
	RawDataState,
	SelectedTabKeyState,
	TimeAlignmentState,
	TreatedUnitsState,
	TreatmentStartDatesAfterEstimateState,
	TreatmentStartDatesState,
} from '../state/state.js'
import {
	CONFIGURATION_TABS,
	MAX_RENDERED_TREATED_UNITS,
	POSSIBLE_COL_NAMES,
} from '../types'
import type {
	ColumnMapping,
	MessageBarProps,
	OutputData,
	PlaceboOutputData,
	SDIDOutputResponse,
	Treatment,
} from '../types.js'
import { csvToRecords, getColumns } from '../utils/csv.js'
import {
	deserializeExportState,
	serializeExportState,
} from '../utils/exportState.js'
import { saveAsFile } from '../utils/file.js'
import { isValidTreatmentDate, isValidUnit } from '../utils/validation.js'
import { ChartOptionsGroup } from './ChartOptionsGroup.js'
import { CheckboxList } from './CheckboxList.js'
import { EstimatorSelector } from './EstimatorSelector.js'
import {
	DropdownContainer,
	hypothesisGroupStyles,
	RightPanelHeader,
	StyledStack,
	Title,
} from './MainContent.styles.js'
import {
	computeRMSPE,
	guessColMapping,
	processOutputData,
	processSynthControlData,
} from './MainContent.utils.js'
import { RangeFilter } from './RangeFilter.js'
import { ResultPane } from './ResultPane.js'
import Spacer from './style/Spacer.js'
import { TimeAlignmentSelector } from './TimeAlignmentSelector.js'
import { TreatmentSelector } from './TreatmentSelector.js'

export const MainContent: React.FC = memo(function MainContent() {
	// Dataset selection (from wrangler)
	const dataTables = useDataTables()

	// Column mapping
	const [columnMapping, setColumnMapping] = useRecoilState(ColumnMappingState)

	const [rawData, setRawData] = useRecoilState(RawDataState)
	const [filter, setFilter] = useRecoilState(FilterState)
	const [aggregateEnabled, setAggregateEnabled] = useRecoilState(
		AggregateEnabledState,
	)
	const [, setAggTreatment] = useRecoilState(AggTreatmentState)

	// Processed Data
	const {
		data,
		isDataLoaded,
		globalDateRange,
		defaultTreatment,
		updateTreatmentsForAggregation,
	} = useProcessedInputData(columnMapping)

	// Display Names
	const [outcomeName, setOutcomeName] = useRecoilState(OutcomeNameState)
	const [eventName, setEventName] = useRecoilState(EventNameState)

	const [fileName, setFileName] = useRecoilState(FileNameState)

	// Treatment setting
	const [treatedUnits, setTreatedUnits] = useRecoilState(TreatedUnitsState)
	const [treatmentStartDates, setTreatmentStartDates] = useRecoilState(
		TreatmentStartDatesState,
	)
	const [checkedUnits, setCheckedUnits] = useRecoilState(CheckedUnitsState)

	// Chart Options
	const [chartOptions, setChartOptions] = useRecoilState(ChartOptionsState)

	const [estimator, setEstimator] = useRecoilState(EstimatorState)

	const [selectedTabKey, setSelectedTabKey] =
		useRecoilState(SelectedTabKeyState)

	const [timeAlignment, setTimeAlignment] = useRecoilState(TimeAlignmentState)

	// TODO: should they be the same as showwhy?
	const [units, setUnits] = useState('')
	const [hypothesis, setHypothesis] = useRecoilState(HypothesisState)

	const onDatasetClicked = (name: string) => {
		const table = dataTables.find(d => d.name === name)?.currentOutput?.table
		if (table) {
			// @FIXME: ideally we should consume the wrangled data-table as is
			//  and not convert it back to CSV before reading its content
			const tableAsCSV = table?.select(not('index')).toCSV()
			handleFileLoad({ fileName: name, content: tableAsCSV })
		}
	}

	// Raw output data
	const [outputRes, setOutputRes] = useRecoilState(OutputResState)

	const [placeboOutputRes, setPlaceboOutputRes] = useRecoilState(
		PlaceboOutputResState,
	)

	// encapsulate the value of treatment-start-date in certain occasions only
	//  e.g., after session data is loaded and after an estimator is executed
	const [
		treatmentStartDatesAfterEstimate,
		setTreatmentStartDatesAfterEstimate,
	] = useRecoilState(TreatmentStartDatesAfterEstimateState)

	const [userMessage, setUserMessage] = useState<MessageBarProps>({
		isVisible: false,
		content: '',
	})

	// Loading state
	const [isCalculatingEstimator, setCalculatingEstimator] = useState(false)
	const [isPlaceboSimulation, setPlaceboSimulation] = useRecoilState(
		PlaceboSimulationState,
	)

	const isInitialRender = useRef(true)

	// Derived values
	const columnsDropdownOptions = getColumns(rawData).map(v => ({
		key: v,
		text: v,
	}))

	// hacks to speed up computation:
	// cache treated units and selected units as maps
	const treatedUnitsMap = useMemo(() => {
		const updatedMap: { [unit: string]: number } = {}
		treatedUnits.forEach(unit => {
			updatedMap[unit] = 1
		})
		return updatedMap
	}, [treatedUnits])

	const unitCheckboxListItems = useMemo(
		() =>
			data.uniqueUnits
				.filter(unit => !treatedUnitsMap[unit])
				.map(unit => ({ name: unit })),
		[data.uniqueUnits, treatedUnitsMap],
	)

	const exportFileName = `${eventName} on ${outcomeName}.sdid.json`.replaceAll(
		' ',
		'_',
	)

	const outputData: (OutputData | PlaceboOutputData)[] = useMemo(
		() => processOutputData(outputRes, treatedUnitsMap),
		[outputRes, treatedUnitsMap],
	)

	const placeboOutputData: Map<string, (OutputData | PlaceboOutputData)[]> =
		useMemo(() => {
			const map = new Map<string, (OutputData | PlaceboOutputData)[]>()
			treatedUnits.forEach(treatedUnit => {
				const output = placeboOutputRes.get(
					treatedUnit,
				) as SDIDOutputResponse | null
				const data = processOutputData(output, treatedUnitsMap)
				map.set(treatedUnit, data)
			})
			return map
		}, [placeboOutputRes, treatedUnitsMap, treatedUnits])

	const synthControlData = useMemo(
		() => processSynthControlData(outputData, checkedUnits),
		[outputData, checkedUnits],
	)

	const getPlaceboOutputRes = useCallback(
		(unit: string): SDIDOutputResponse => {
			return placeboOutputRes.get(unit) as SDIDOutputResponse
		},
		[placeboOutputRes],
	)

	const placeboDataGroup = useMemo(() => {
		const map = new Map()
		treatedUnits.forEach(treatedUnit => {
			const output = computeRMSPE(
				getPlaceboOutputRes(treatedUnit),
				data.startDate,
				data.endDate,
				treatmentStartDatesAfterEstimate,
				[treatedUnit],
				checkedUnits,
			)
			map.set(treatedUnit, output)
		})
		return map
	}, [
		outputRes,
		data,
		treatmentStartDatesAfterEstimate,
		checkedUnits,
		treatedUnits,
		getPlaceboOutputRes,
	])

	useEffect(() => {
		// initially, all units are checked
		if (checkedUnits === null && data.uniqueUnits.length) {
			setCheckedUnits(new Set(data.uniqueUnits))
		}
	}, [data])

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

	const clearAllState = () => {
		setRawData([])
		setPlaceboOutputRes(new Map())
		setOutputRes(null)
		setFilter(null)
		setTreatmentStartDates([])
		setTreatedUnits([])
		setCheckedUnits(null)
		setUserMessage({ isVisible: false, content: '' })
		setPlaceboSimulation(false)
		setAggregateEnabled(false)
		setAggTreatment(null)
		setTreatmentStartDatesAfterEstimate(null)
	}

	const resetDataHandler = () => {
		if (!isDataLoaded) {
			setUserMessage({
				isVisible: true,
				content: 'No data is loaded yet. Please load a valid dataset first!',
				type: MessageBarType.error,
			})
			return
		}
		setFilter(null)
		// we have just invalidated the input,
		// so the existing output should be ignored or better yet back to the input view
		setOutputRes(null)
	}

	const filterDataHandler = (filterRange: [number, number]) => {
		if (!isDataLoaded) {
			setUserMessage({
				isVisible: true,
				content: 'No data is loaded yet. Please load a valid dataset first!',
				type: MessageBarType.error,
			})
			return
		}
		const [startDate, endDate] = filterRange
		// pretend a new treatment start date as the middle of the pre-treatment range
		//  and update the data accordingly
		const placeboTreatmentStartDate = Math.floor(
			startDate + (endDate - startDate) / 2,
		)
		// if any of the treatment start dates outside the date range of the date,
		//  move it to the middle of the data range
		const tempDate: number[] = []
		treatmentStartDates.forEach(date => {
			if (date <= startDate || date >= endDate) {
				tempDate.push(placeboTreatmentStartDate)
			} else {
				tempDate.push(date)
			}
		})
		if (!isEqual(treatmentStartDates, tempDate)) {
			setTreatmentStartDates(tempDate)
		}

		setFilter({ startDate, endDate })

		// we have just invalidated the input,
		// so the existing output should be ignored or better yet back to the input view
		setOutputRes(null)
		setTreatmentStartDatesAfterEstimate(null)
		//  automatically un-toggle the raw input and hide the synth control and counterfactual
		setChartOptions({
			...chartOptions,
			renderRawData: true,
			showSynthControl: false,
		})
	}

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
		setPlaceboOutputRes(new Map())
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
			setPlaceboOutputRes(new Map())
			return
		}
		setUserMessage({
			isVisible: false,
			content: '',
		})
		if (placebo) {
			setPlaceboOutputRes(prev => {
				const map = new Map(prev)
				map.set(treatedUnitsList[0], outputsResponse)
				return map
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

	const updateColumnMapping = (mapping: ColumnMapping) => {
		const newMapping = { ...columnMapping, ...mapping }
		if (isEqual(newMapping, columnMapping)) return
		setColumnMapping(newMapping)
	}

	const handleOutColumnChange = (
		e: FormEvent<HTMLDivElement>,
		option?: IDropdownOption<string>,
	) => {
		const outCol = '' + (option?.key.toString() ?? '')
		if (outCol !== '') {
			const newMapping = { ...columnMapping, ...{ value: outCol } }
			if (!isEqual(newMapping, columnMapping)) setColumnMapping(newMapping)
			setOutcomeName(prev => (!prev ? outCol : prev))
		}
	}

	const handleTreatmentDateChange = useCallback(
		(treatmentDate: number, treatedUnit: string) => {
			const treatedUnitIndex = treatedUnits.findIndex(
				unit => unit === treatedUnit,
			)
			const updatedPeriods = clone(treatmentStartDates)
			updatedPeriods[treatedUnitIndex] = treatmentDate
			setTreatmentStartDates(updatedPeriods)
		},
		[setTreatmentStartDates, treatedUnits, treatmentStartDates],
	)

	const handleTreatedUnitChange = useCallback(
		(oldTreatedUnit: string, newTreatedUnit: string) => {
			// if newly selected treated unit exist in the list of treated unit, then do not proceed
			// otherwise, update the list of treated unit with the new selection
			const oldTreatedUnitIndex = treatedUnits.findIndex(
				unit => unit === oldTreatedUnit,
			)
			const newTreatedUnitIndex = treatedUnits.findIndex(
				unit => unit === newTreatedUnit,
			)
			if (newTreatedUnitIndex < 0) {
				const updatedUnits = clone(treatedUnits)
				updatedUnits[oldTreatedUnitIndex] = newTreatedUnit
				setTreatedUnits(updatedUnits)
			}
		},
		[setTreatedUnits, treatedUnits],
	)

	const handleRemoveTreatmentUnit = useCallback(
		(treatedUnit: string) => {
			const treatedUnitIndex = treatedUnits.findIndex(
				unit => unit === treatedUnit,
			)
			const updatedUnits = treatedUnits.filter(unit => unit !== treatedUnit)
			const updatedPeriods = clone(treatmentStartDates)
			updatedPeriods.splice(treatedUnitIndex, 1) // remove at index
			setTreatedUnits(updatedUnits)
			setTreatmentStartDates(updatedPeriods)

			if (updatedUnits.length === 0) {
				// clear output data
				setOutputRes(null)
				setPlaceboOutputRes(new Map())
			} else {
				// a treated unit may have been removed
				// ensure that any cached output for such removed unit is also filtered out
				if (outputRes !== null) {
					const updatedOutputRes = cloneDeep(outputRes)
					setOutputRes({
						...updatedOutputRes,
						outputs: updatedOutputRes.outputs.filter(output =>
							treatedUnits.includes(output.unit),
						),
					})
				}
			}
		},
		[treatedUnits, treatmentStartDates, outputRes],
	)

	const addNewTreatedUnit = useCallback(() => {
		if (data.uniqueUnits.length) {
			let updatedUnits: string[] = []
			let updatedPeriods: number[] = []
			if (treatedUnits.length) {
				// pick next untreated unit
				const controlUnits = data.uniqueUnits.filter(unit =>
					treatedUnits.every(tUnit => unit !== tUnit),
				)
				updatedUnits = [...treatedUnits, controlUnits[0]]
				updatedPeriods = [...treatmentStartDates, treatmentStartDates[0]]
			} else {
				updatedUnits = [data.uniqueUnits[0]]
				updatedPeriods = [data.startDate]
			}
			setTreatedUnits(updatedUnits)
			setTreatmentStartDates(updatedPeriods)
		}
	}, [treatedUnits, treatmentStartDates, data])

	const handleEstimatorChange = useCallback(
		(newEstimator: string) => {
			setEstimator(newEstimator)
		},
		[setEstimator],
	)

	const handleTimeAlignmentChange = useCallback(
		(newAlignment: string) => {
			setTimeAlignment(newAlignment)
		},
		[setTimeAlignment],
	)

	const handleSelectAllUnits = useCallback(() => {
		if (checkedUnits !== null && data.uniqueUnits.length) {
			const checkedUnitCount = validTreatedUnits
				? checkedUnits.size - treatedUnits.length
				: checkedUnits.size
			if (checkedUnitCount === unitCheckboxListItems.length) {
				// all units are checked, then de-select all
				setCheckedUnits(new Set([]))
			} else {
				// select all units
				setCheckedUnits(new Set(data.uniqueUnits))
			}
		}
	}, [
		checkedUnits,
		unitCheckboxListItems,
		data,
		validTreatedUnits,
		treatedUnits,
	])

	const enableRegroupButton = useMemo(() => {
		const nonGroupedUnits = treatedUnits.filter(
			unit => !unit.startsWith('Group_'),
		)
		return aggregateEnabled && nonGroupedUnits.length > 0
	}, [aggregateEnabled, treatedUnits])

	const updateTreatmentsForAgg = useCallback(() => {
		// Construct treatment including group info
		const treatment: Treatment = {
			units: treatedUnits,
			startDates: treatmentStartDates,
			groups: {},
		}
		// Extract grouped units information
		treatedUnits.forEach(unit => {
			const groupedUnits = defaultTreatment?.groups[unit]
			if (groupedUnits) {
				treatment.groups[unit] = groupedUnits
			}
		})
		updateTreatmentsForAggregation(treatment)
	}, [treatedUnits, treatmentStartDates])

	const handleAggregateOption = useCallback(() => {
		const enabled = !aggregateEnabled
		updateTreatmentsForAgg()
		setAggregateEnabled(enabled)
	}, [aggregateEnabled, setAggregateEnabled, updateTreatmentsForAgg])

	const handleReAggregate = useCallback(() => {
		updateTreatmentsForAgg()
	}, [updateTreatmentsForAgg])

	const onHandleTabClicked = useCallback(
		(itemClicked?: PivotItem) => {
			const itemKey = itemClicked?.props.itemKey
				? itemClicked.props.itemKey
				: ''
			setSelectedTabKey(itemKey)
		},
		[setSelectedTabKey],
	)

	const handleFileLoad = ({
		fileName,
		content,
	}: {
		fileName: string
		content: string
	}) => {
		// clear old state since we are loading a new data set
		clearAllState()

		const exportState = deserializeExportState(content)
		// If not exportState, assume the content is csv
		if (!exportState) {
			const records = csvToRecords(content)
			setRawData(records)
			const mapping = guessColMapping(getColumns(records))
			setColumnMapping(mapping)
			setOutcomeName(prev => (!prev ? mapping.value : prev))
			setFileName(fileName)
		} else {
			const {
				rawData,
				eventName,
				outcomeName,
				columnMapping,
				treatmentStartDates,
				treatedUnits,
				checkedUnits,
				chartOptions,
				estimator,
				timeAlignment,
				filter,
				outputData,
			} = exportState
			setRawData(rawData)
			setEventName(eventName)
			setOutcomeName(outcomeName)
			updateColumnMapping(columnMapping)
			setTreatedUnits(treatedUnits)
			setTreatmentStartDates(treatmentStartDates)
			setChartOptions(chartOptions)
			setCheckedUnits(checkedUnits)
			setEstimator(estimator)
			setTimeAlignment(timeAlignment)
			setFilter(filter)
			setOutputRes(outputData)
			if (outputData) setPlaceboSimulation(outputData.compute_placebos)
			setTreatmentStartDatesAfterEstimate({ tStartDates: treatmentStartDates })
			setFileName('')
		}
	}

	const handleExport = () => {
		if (!isDataLoaded) return
		const payload = serializeExportState({
			rawData,
			eventName,
			outcomeName,
			columnMapping,
			filter,
			treatmentStartDates,
			treatedUnits,
			checkedUnits,
			chartOptions,
			estimator,
			timeAlignment,
			outputData: outputRes,
			aggregateEnabled,
		})
		saveAsFile(`${exportFileName}`, payload, 'application/json')
	}

	const handleRemoveCheckedUnit = useCallback(
		(unitToRemove: string) => {
			const checkedUnitsCopy = new Set(checkedUnits)
			checkedUnitsCopy?.delete(unitToRemove)
			setCheckedUnits(checkedUnitsCopy)
		},
		[checkedUnits],
	)

	const tooltipHostStyles: Partial<ITooltipHostStyles> = {
		root: {
			display: 'inline-block',
			verticalAlign: 'middle',
			marginLeft: '0.5rem',
		},
	}

	const revealErrors = useMemo(() => {
		if (
			isDataLoaded &&
			cannotCalculateEstimate &&
			cannotCalculatePlacebo &&
			!isCalculatingEstimator
		) {
			return (
				<FontIcon
					iconName="Info"
					className="bad-input"
					onClick={checkCanExecuteEstimator}
				/>
			)
		} else {
			return <></>
		}
	}, [
		checkCanExecuteEstimator,
		cannotCalculateEstimate,
		cannotCalculatePlacebo,
		isDataLoaded,
		isCalculatingEstimator,
	])

	const controlUnitsChecked = useMemo(() => {
		return checkedUnits
			? validTreatedUnits
				? checkedUnits.size - treatedUnits.length ===
				  unitCheckboxListItems.length
				: checkedUnits.size === unitCheckboxListItems.length
			: false
	}, [checkedUnits, validTreatedUnits, unitCheckboxListItems, treatedUnits])

	const controlUnitsIntermediateChecked = useMemo(() => {
		return checkedUnits
			? (validTreatedUnits
					? checkedUnits.size - treatedUnits.length !==
					  unitCheckboxListItems.length
					: checkedUnits.size !== unitCheckboxListItems.length) &&
					checkedUnits.size !== 0
			: false
	}, [checkedUnits, validTreatedUnits, unitCheckboxListItems, treatedUnits])

	const treatmentSelector = useMemo(() => {
		const clearAllTreatedUnits = () => {
			setTreatedUnits([])
			setTreatmentStartDates([])
			setPlaceboOutputRes(new Map())
			setOutputRes(null)
		}
		const differentTreatmentPeriods =
			treatmentStartDates.length > 0 && uniq(treatmentStartDates).length !== 1
		const treatmentList =
			treatedUnits.length > MAX_RENDERED_TREATED_UNITS ? (
				<Stack horizontal className="unit-selection-header">
					<Stack.Item>
						<Text>
							Treated Units: <b>{treatedUnits.length}</b>
						</Text>
					</Stack.Item>
					<Stack.Item align="end">
						<FontIcon
							iconName="SkypeCircleMinus"
							className="remove-treated-unit"
							onClick={clearAllTreatedUnits}
						/>
					</Stack.Item>
				</Stack>
			) : (
				treatedUnits.map((treatedUnit, index) => (
					<TreatmentSelector
						key={treatedUnit}
						units={data.uniqueUnits}
						minDate={data.startDate}
						maxDate={data.endDate}
						onTreatedUnitChange={handleTreatedUnitChange}
						onTreatmentDateChange={handleTreatmentDateChange}
						treatmentStartDate={treatmentStartDates[index]}
						treatedUnit={treatedUnit}
						onDelete={handleRemoveTreatmentUnit}
					/>
				))
			)
		return (
			<Stack>
				<Stack.Item className="treatment-list">{treatmentList}</Stack.Item>
				<Stack.Item align="center">
					<ActionButton
						iconProps={{ iconName: 'CirclePlus' }}
						className="add-treated-unit"
						onClick={addNewTreatedUnit}
						text="Add treated unit"
					/>
				</Stack.Item>
				<Stack.Item>
					{differentTreatmentPeriods && (
						<Stack tokens={{ childrenGap: 2 }} horizontal>
							<Stack.Item align="center" className="time-effect-label">
								<Text>Time Effect Heterogeneity:</Text>
							</Stack.Item>
							<Stack.Item grow={1} className="time-effect-selector">
								<TimeAlignmentSelector
									alignment={timeAlignment}
									onTimeAlignmentChange={handleTimeAlignmentChange}
								/>
							</Stack.Item>
						</Stack>
					)}
				</Stack.Item>
			</Stack>
		)
	}, [
		data,
		treatmentStartDates,
		treatedUnits,
		addNewTreatedUnit,
		handleTreatedUnitChange,
		handleTreatmentDateChange,
		handleRemoveTreatmentUnit,
		timeAlignment,
		handleTimeAlignmentChange,
	])

	const onUnitUpdate = useCallback(
		(value?: IDropdownOption) => {
			const unit = !value ? '' : String(value.key)
			updateColumnMapping({ unit })
			setUnits(prev => (!prev ? unit : prev))
		},
		[setUnits, updateColumnMapping],
	)

	useEffect(() => {
		setChartOptions(prev => ({
			...prev,
			renderRawData: selectedTabKey === CONFIGURATION_TABS.prepareAnalysis.key,
		}))
	}, [selectedTabKey])

	return (
		<StyledStack grow horizontal verticalFill>
			<Stack.Item>
				<Stack tokens={{ childrenGap: 5 }} className="leftPanel">
					<Pivot
						aria-label="SynthDiD Navigation Tabs"
						className="tabControl"
						onLinkClick={onHandleTabClicked}
						selectedKey={selectedTabKey}
					>
						<PivotItem
							headerText={CONFIGURATION_TABS.prepareAnalysis.label}
							itemKey={CONFIGURATION_TABS.prepareAnalysis.key}
						>
							<Stack tokens={{ childrenGap: 5 }}>
								<Text className="stepText">1. Load your data set</Text>
								<Text className="stepDesc">
									Load a dataset in&nbsp;
									<Link
										href="https://en.wikipedia.org/wiki/Panel_data"
										target="_blank"
									>
										panel data format
									</Link>
									&nbsp;to get started
								</Text>
								<Stack horizontal tokens={{ childrenGap: 10 }}>
									<MenuBar
										dataTables={dataTables}
										onItemClicked={onDatasetClicked}
									/>
									<Stack.Item align="center">
										<Text>{fileName}</Text>
									</Stack.Item>
								</Stack>
							</Stack>

							<Spacer axis="vertical" size={15} />

							<Stack tokens={{ childrenGap: 5 }}>
								<Text className="stepText">
									2. Select time, units, and outcome columns
								</Text>
								<Text className="stepDesc">
									Select data columns representing the time periods (e.g.,
									years) in which the units of your analysis (e.g., different
									regions or groups) were observed to have outcomes before and
									after the event/treatment of interest
								</Text>
								<DropdownContainer>
									<Dropdown
										placeholder="Time"
										className={
											columnMapping.date === '' ? 'colInvalidSelection' : ''
										}
										options={columnsDropdownOptions}
										selectedKey={columnMapping.date}
										onChange={(e, val) =>
											updateColumnMapping({
												date: !val ? '' : String(val.key),
											})
										}
									/>
									<Dropdown
										placeholder="Units"
										className={
											columnMapping.unit === '' ? 'colInvalidSelection' : ''
										}
										options={columnsDropdownOptions}
										selectedKey={columnMapping.unit}
										onChange={(e, val) => onUnitUpdate(val)}
									/>
									<Dropdown
										placeholder="Outcome"
										className={
											columnMapping.value === '' ? 'colInvalidSelection' : ''
										}
										options={columnsDropdownOptions}
										selectedKey={columnMapping.value}
										onChange={handleOutColumnChange}
									/>
								</DropdownContainer>

								{data.nonBalancedUnits?.length && !!columnMapping.value ? (
									<Stack horizontal tokens={{ childrenGap: 10, padding: 10 }}>
										<Text>
											{data.nonBalancedUnits.length} units missing outcomes have
											been excluded
										</Text>
										<TooltipHost
											content={data.nonBalancedUnits.map((i, key) => (
												<Text
													key={key}
													block
													styles={{ root: { marginBottom: '10px' } }}
												>
													{i}
												</Text>
											))}
											id="nonBalancedUnits"
											styles={tooltipHostStyles}
										>
											<FontIcon
												iconName="Info"
												className="non-balanced-units-icon"
												aria-describedby="nonBalancedUnits"
											/>
										</TooltipHost>
									</Stack>
								) : null}
							</Stack>

							<Spacer axis="vertical" size={15} />

							<Stack tokens={{ childrenGap: 5 }}>
								<Text className="stepText">
									3. Define treatment units and time periods
								</Text>
								<Text className="stepDesc">
									Select some units and time-periods to consider as treated.
									Alternately, if your dataset contains a column specifying a
									treatment, select the column to automatically create
									treatments.
								</Text>
								<Spacer axis="vertical" size={5} />
								<Stack horizontal horizontalAlign="space-between">
									<Stack.Item align="baseline">
										<Checkbox
											label="Aggregate Treated Units"
											checked={aggregateEnabled}
											onChange={handleAggregateOption}
										/>
									</Stack.Item>
									<DefaultButton
										text="Regroup"
										onClick={handleReAggregate}
										disabled={!enableRegroupButton}
									/>
								</Stack>
								<Spacer axis="vertical" size={5} />
								{treatmentSelector}
								<Stack tokens={{ padding: 5 }}>
									<Stack.Item align="center">OR</Stack.Item>
								</Stack>
								<Stack horizontal tokens={{ childrenGap: 3 }}>
									<Stack.Item>
										<DefaultButton
											text="Automatically create treatments from column:"
											disabled
											styles={{
												label: { color: 'black' },
												root: { padding: 16 },
											}}
										/>
									</Stack.Item>
									<Stack.Item grow>
										<Dropdown
											placeholder="Select treated column"
											options={columnsDropdownOptions}
											selectedKey={columnMapping.treated}
											onChange={(e, val) =>
												updateColumnMapping({
													treated: !val ? '' : String(val.key),
												})
											}
										/>
									</Stack.Item>
									<Stack.Item align="center">
										<FontIcon
											iconName="Cancel"
											className="attributeClearSelection"
											onClick={() => {
												updateColumnMapping({ treated: '' })
											}}
										/>
									</Stack.Item>
								</Stack>
							</Stack>

							<Spacer axis="vertical" size={15} />

							<Stack>
								<Text className="stepText">4. Format causal question</Text>
								<Stack horizontal>
									<Stack tokens={{ childrenGap: 5, padding: 10 }}>
										<Text className="stepText">Units</Text>
										<TextField
											placeholder="Units"
											value={units}
											onChange={(e, v) => setUnits(v || '')}
										/>
									</Stack>
									<Stack tokens={{ childrenGap: 5, padding: 10 }}>
										<Text className="stepText">Event</Text>
										<TextField
											placeholder="Event"
											value={eventName}
											onChange={(e, v) => setEventName(v || '')}
										/>
									</Stack>
									<Stack tokens={{ childrenGap: 5, padding: 10 }}>
										<Text className="stepText">Outcome</Text>
										<TextField
											placeholder="Outcome"
											value={outcomeName}
											onChange={(e, v) => setOutcomeName(v || '')}
										/>
									</Stack>
								</Stack>

								<Stack tokens={{ childrenGap: 5, padding: 10 }}>
									<Text className="stepText">Hypothesis</Text>
									<HypothesisGroup
										onChange={(_, o) => setHypothesis(o?.key as Hypothesis)}
										hypothesis={hypothesis as Hypothesis}
										styles={hypothesisGroupStyles}
									/>
								</Stack>
							</Stack>

							<Stack>
								<Text className="stepText">Chart Options</Text>
								<Stack tokens={{ childrenGap: 5, padding: 5 }}>
									<Checkbox
										label="Show treatment start indicator"
										checked={chartOptions.showTreatmentStart}
										onChange={(e, isChecked) =>
											setChartOptions({
												...chartOptions,
												showTreatmentStart: !!isChecked,
											})
										}
									/>
								</Stack>
							</Stack>
						</PivotItem>
						<PivotItem
							headerText={CONFIGURATION_TABS.estimateEffects.label}
							itemKey={CONFIGURATION_TABS.estimateEffects.key}
						>
							<Stack tokens={{ childrenGap: 5 }}>
								<Stack
									horizontal
									tokens={{ childrenGap: 5 }}
									className="unit-selection-header"
								>
									<Label className="stepText">Unit Selection</Label>
									<Checkbox
										label="Select All/None"
										checked={controlUnitsChecked}
										indeterminate={controlUnitsIntermediateChecked}
										onChange={handleSelectAllUnits}
									/>
								</Stack>
								<Text className="stepDesc">
									Include or exclude units from the pool of data that can be
									used to generate our synthetic control
								</Text>
								<CheckboxList
									selection={checkedUnits || new Set([])}
									items={unitCheckboxListItems}
									onSelectionChange={selection => setCheckedUnits(selection)}
									height={175}
								/>
							</Stack>

							<Spacer axis="vertical" size={5} />

							<Label>Treated unit(s) and Treatment period(s)</Label>
							{treatmentSelector}

							<Spacer axis="vertical" size={15} />

							<Stack>
								<Label>
									<Text className="stepText">Filter Data</Text>
									<TooltipHost
										content="Use the Start/End dates to customize and filter the data range"
										id="filterDataTooltipId"
										styles={tooltipHostStyles}
									>
										<FontIcon
											iconName="Info"
											className="filter-data-icon"
											aria-describedby="filterDataTooltipId"
										/>
									</TooltipHost>
								</Label>
								<Text>
									Constrain the time before and after the event used to
									calculate the causal effect
								</Text>
								<RangeFilter
									defaultRange={filter && [filter.startDate, filter.endDate]}
									labelStart="Start date"
									labelEnd="End date"
									min={globalDateRange.startDate}
									max={globalDateRange.endDate}
									step={1}
									onApply={filterDataHandler}
									onReset={resetDataHandler}
								/>
							</Stack>

							<Spacer axis="vertical" size={15} />

							<EstimatorSelector
								estimator={estimator}
								onEstimatorChange={handleEstimatorChange}
							/>

							<Spacer axis="vertical" size={5} />

							<Stack tokens={{ childrenGap: 5 }}>
								<Stack horizontal grow tokens={{ childrenGap: 5 }}>
									<PrimaryButton
										disabled={cannotCalculateEstimate}
										text="Calculate causal estimate"
										onClick={() => void calculateEstimate()}
									/>
									{isCalculatingEstimator && !isPlaceboSimulation && (
										<Spinner size={SpinnerSize.medium} />
									)}
									{revealErrors}
								</Stack>
							</Stack>
							<Spacer axis="vertical" size={20} />

							<Text className="stepText">Chart Options</Text>
							<Stack tokens={{ childrenGap: 5, padding: 5 }}>
								<ChartOptionsGroup
									options={chartOptions}
									onChange={setChartOptions}
									isPlaceboSimulation={isPlaceboSimulation}
								/>
							</Stack>
						</PivotItem>
						<PivotItem
							headerText={CONFIGURATION_TABS.validateEffects.label}
							itemKey={CONFIGURATION_TABS.validateEffects.key}
						>
							<Stack tokens={{ childrenGap: 5 }}>
								<Label className="stepText">Run placebo simulation</Label>
								<Text className="stepDesc">
									Compare treated effects to placebo effects of untreated units
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
				<RightPanelHeader>
					<Stack tokens={{ childrenGap: 5 }}>
						<Title>
							For {units || '<units>'}, did {eventName || '<event>'} cause{' '}
							{outcomeName || '<outcome>'} to {hypothesis || '<hypothesis>'}?
						</Title>
					</Stack>
					{/* TODO: Uncomment when we have a pdf-like report to export */}
					{/* <Stack>
						<Stack.Item align="end">
							<ActionButton
								text="Export Results"
								disabled={
									(cannotCalculateEstimate && cannotCalculatePlacebo) ||
									isCalculatingEstimator
								}
								onClick={handleExport}
							/>
						</Stack.Item>
					</Stack> */}
				</RightPanelHeader>
				<ResultPane
					inputData={data}
					outputData={outputData}
					placeboOutputData={placeboOutputData}
					synthControlData={synthControlData}
					statusMessage={userMessage}
					isCalculatingEstimator={isCalculatingEstimator}
					placeboDataGroup={placeboDataGroup}
					timeAlignment={timeAlignment}
					checkableUnits={unitCheckboxListItems.map(unit => unit.name)}
					onRemoveCheckedUnit={handleRemoveCheckedUnit}
				/>
			</Stack.Item>
		</StyledStack>
	)
})
