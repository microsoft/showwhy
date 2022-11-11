/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Hypothesis } from '@showwhy/app-common'
import { AppResourceHandler, useDataPackage } from '@datashaper/app-framework'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

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
	UnitsState,
} from '../state/state.js'
import type {
	ChartOptions,
	ColumnMapping,
	DateFilter,
	SDIDOutputResponse,
	Treatment,
} from '../types.js'
import type { Record as CsvRecord } from '../utils/csv.js'

interface ProjectJson {
	rawData: CsvRecord[]
	columnMapping: ColumnMapping
	outcomeName: string
	eventName: string
	fileName: string
	estimator: string
	treatedUnits: string[]
	treatmentStartDates: number[]
	checkedUnits: string[] | null
	chartOptions: ChartOptions
	filter: DateFilter | null
	outputRes: SDIDOutputResponse | null
	placeboOutputRes: Record<string, SDIDOutputResponse | null>
	placeboSimulation: boolean
	selectedTabKey: string
	timeAlignment: string
	aggTreatment: Treatment | null
	aggregateEnabled: boolean
	hypothesis: Hypothesis | null
	treatmentStartDatesAfterEstimate: {
		tStartDates: number[]
	} | null
	units: string
}

export const EventsPersistenceProvider: React.FC = memo(
	function EventsPersistenceProvider() {
		const dp = useDataPackage()
		const getProjectJson = useGetProjectJson()
		const loadProjectJson = useLoadProjectJson()

		const persistable = useMemo(
			() =>
				new AppResourceHandler<ProjectJson>(
					'events',
					'events',
					getProjectJson,
					loadProjectJson,
				),
			[getProjectJson, loadProjectJson],
		)

		useEffect(() => {
			dp.addResourceHandler(persistable)
		}, [dp, persistable])

		// renderless component
		return null
	},
)

function useGetProjectJson(): () => ProjectJson {
	const rawData = useRecoilValue(RawDataState)
	const columnMapping = useRecoilValue(ColumnMappingState)
	const outcomeName = useRecoilValue(OutcomeNameState)
	const eventName = useRecoilValue(EventNameState)
	const fileName = useRecoilValue(FileNameState)
	const estimator = useRecoilValue(EstimatorState)
	const treatedUnits = useRecoilValue(TreatedUnitsState)
	const treatmentStartDates = useRecoilValue(TreatmentStartDatesState)
	const checkedUnits = useRecoilValue(CheckedUnitsState)
	const chartOptions = useRecoilValue(ChartOptionsState)
	const filter = useRecoilValue(FilterState)
	const outputRes = useRecoilValue(OutputResState)
	const placeboOutputRes = useRecoilValue(PlaceboOutputResState)
	const placeboSimulation = useRecoilValue(PlaceboSimulationState)
	const selectedTabKey = useRecoilValue(SelectedTabKeyState)
	const timeAlignment = useRecoilValue(TimeAlignmentState)
	const aggTreatment = useRecoilValue(AggTreatmentState)
	const aggregateEnabled = useRecoilValue(AggregateEnabledState)
	const hypothesis = useRecoilValue(HypothesisState)
	const units = useRecoilValue(UnitsState)
	const treatmentStartDatesAfterEstimate = useRecoilValue(
		TreatmentStartDatesAfterEstimateState,
	)

	return useCallback(
		() => ({
			rawData,
			columnMapping,
			outcomeName,
			eventName,
			fileName,
			estimator,
			treatedUnits,
			treatmentStartDates,
			checkedUnits: [...(checkedUnits?.values() ?? [])],
			chartOptions,
			filter,
			outputRes,
			placeboOutputRes: hashMap(placeboOutputRes),
			placeboSimulation,
			selectedTabKey,
			timeAlignment,
			aggTreatment,
			aggregateEnabled,
			hypothesis,
			units,
			treatmentStartDatesAfterEstimate,
		}),
		[
			rawData,
			columnMapping,
			outcomeName,
			eventName,
			fileName,
			estimator,
			treatedUnits,
			treatmentStartDates,
			checkedUnits,
			chartOptions,
			filter,
			outputRes,
			placeboOutputRes,
			placeboSimulation,
			selectedTabKey,
			timeAlignment,
			aggTreatment,
			aggregateEnabled,
			hypothesis,
			units,
			treatmentStartDatesAfterEstimate,
		],
	)
}

function hashMap<V>(m: Map<string, V>): Record<string, V> {
	const result: Record<string, V> = {}
	m.forEach((v, k) => (result[k] = v))
	return result
}

function useLoadProjectJson(): (json: ProjectJson) => void {
	const setRawData = useSetRecoilState(RawDataState)
	const setColumnMapping = useSetRecoilState(ColumnMappingState)
	const setOutcomeName = useSetRecoilState(OutcomeNameState)
	const setEventName = useSetRecoilState(EventNameState)
	const setFileName = useSetRecoilState(FileNameState)
	const setEstimator = useSetRecoilState(EstimatorState)
	const setTreatedUnits = useSetRecoilState(TreatedUnitsState)
	const setTreatmentStartDates = useSetRecoilState(TreatmentStartDatesState)
	const setCheckedUnits = useSetRecoilState(CheckedUnitsState)
	const setChartOptions = useSetRecoilState(ChartOptionsState)
	const setFilter = useSetRecoilState(FilterState)
	const setOutputRes = useSetRecoilState(OutputResState)
	const setPlaceboOutputRes = useSetRecoilState(PlaceboOutputResState)
	const setPlaceboSimulation = useSetRecoilState(PlaceboSimulationState)
	const setSelectedTabKey = useSetRecoilState(SelectedTabKeyState)
	const setTimeAlignment = useSetRecoilState(TimeAlignmentState)
	const setAggTreatment = useSetRecoilState(AggTreatmentState)
	const setAggregateEnabled = useSetRecoilState(AggregateEnabledState)
	const setHypothesis = useSetRecoilState(HypothesisState)
	const setUnits = useSetRecoilState(UnitsState)
	const setTreatmentStartDatesAfterEstimate = useSetRecoilState(
		TreatmentStartDatesAfterEstimateState,
	)

	return useCallback(
		(json: ProjectJson) => {
			setRawData(json.rawData)
			setColumnMapping(json.columnMapping)
			setOutcomeName(json.outcomeName)
			setEventName(json.eventName)
			setFileName(json.fileName)
			setEstimator(json.estimator)
			setTreatedUnits(json.treatedUnits)
			setTreatmentStartDates(json.treatmentStartDates)
			setCheckedUnits(new Set(json.checkedUnits))
			setChartOptions(json.chartOptions)
			setFilter(json.filter)
			setOutputRes(json.outputRes)
			setPlaceboOutputRes(new Map(Object.entries(json.placeboOutputRes)))
			setPlaceboSimulation(json.placeboSimulation)
			setSelectedTabKey(json.selectedTabKey)
			setTimeAlignment(json.timeAlignment)
			setAggTreatment(json.aggTreatment)
			setAggregateEnabled(json.aggregateEnabled)
			setHypothesis(json.hypothesis)
			setUnits(json.units)
			setTreatmentStartDatesAfterEstimate(json.treatmentStartDatesAfterEstimate)
		},
		[
			setRawData,
			setColumnMapping,
			setOutcomeName,
			setEventName,
			setFileName,
			setEstimator,
			setTreatedUnits,
			setTreatmentStartDates,
			setCheckedUnits,
			setChartOptions,
			setFilter,
			setOutputRes,
			setPlaceboOutputRes,
			setPlaceboSimulation,
			setSelectedTabKey,
			setTimeAlignment,
			setAggTreatment,
			setAggregateEnabled,
			setHypothesis,
			setUnits,
			setTreatmentStartDatesAfterEstimate,
		],
	)
}
