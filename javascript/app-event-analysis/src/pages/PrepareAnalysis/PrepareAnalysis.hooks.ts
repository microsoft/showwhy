/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { useUpdateColumnMapping } from '../../hooks/useUpdateColumnMapping.js'
import {
	useAggregateEnabledResetState,
	useAggTreatmentResetState,
	useCheckedUnitsResetState,
	useFilterResetState,
	useOutputResResetState,
	usePlaceboOutputResResetState,
	usePlaceboSimulationResetState,
	useRawDataResetState,
	useSetChartOptionsState,
	useSetCheckedUnitsState,
	useSetColumnMappingState,
	useSetEstimatorState,
	useSetEventNameState,
	useSetFileNameState,
	useSetFilterState,
	useSetOutcomeNameState,
	useSetOutputResState,
	useSetPlaceboSimulationState,
	useSetRawDataState,
	useSetTimeAlignmentState,
	useSetTreatedUnitsState,
	useSetTreatmentStartDatesAfterEstimateState,
	useSetTreatmentStartDatesState,
	useTreatedUnitsResetState,
	useTreatmentStartDatesAfterEstimateResetState,
	useTreatmentStartDatesResetState,
	useUserMessageResetState,
} from '../../state/index.js'
import { csvToRecords, getColumns } from '../../utils/csv.js'
import { deserializeExportState } from '../../utils/exportState.js'
import { guessColMapping } from '../../utils/guessColorMapping.js'

export function useClearAllState() {
	const resetRawData = useRawDataResetState()
	const resetPlaceboOutputRes = usePlaceboOutputResResetState()
	const resetOutputRes = useOutputResResetState()
	const resetFilter = useFilterResetState()
	const resetTreatmentStartDates = useTreatmentStartDatesResetState()
	const resetTreatedUnits = useTreatedUnitsResetState()
	const resetCheckedUnits = useCheckedUnitsResetState()
	const resetPlaceboSimulation = usePlaceboSimulationResetState()
	const resetAggregateEnabled = useAggregateEnabledResetState()
	const resetAggTreatment = useAggTreatmentResetState()
	const resetTreatmentStartDatesAfterEstimate =
		useTreatmentStartDatesAfterEstimateResetState()
	const resetUserMessage = useUserMessageResetState()

	return useCallback(() => {
		resetRawData()
		resetPlaceboOutputRes()
		resetOutputRes()
		resetAggTreatment()
		resetUserMessage()
		resetFilter()
		resetTreatmentStartDates()
		resetTreatedUnits()
		resetCheckedUnits()
		resetPlaceboSimulation()
		resetAggregateEnabled()
		resetTreatmentStartDatesAfterEstimate()
	}, [
		resetRawData,
		resetPlaceboOutputRes,
		resetOutputRes,
		resetFilter,
		resetTreatmentStartDates,
		resetTreatedUnits,
		resetCheckedUnits,
		resetUserMessage,
		resetPlaceboSimulation,
		resetAggregateEnabled,
		resetAggTreatment,
		resetTreatmentStartDatesAfterEstimate,
	])
}

export function useHandleFileLoad() {
	const clearAllState = useClearAllState()
	const updateColumnMapping = useUpdateColumnMapping()
	const setOutputRes = useSetOutputResState()
	const setFilter = useSetFilterState()
	const setCheckedUnits = useSetCheckedUnitsState()
	const setPlaceboSimulation = useSetPlaceboSimulationState()
	const setTreatmentStartDatesAfterEstimate =
		useSetTreatmentStartDatesAfterEstimateState()
	const setEstimator = useSetEstimatorState()
	const setTimeAlignment = useSetTimeAlignmentState()
	const setRawData = useSetRawDataState()
	const setFileName = useSetFileNameState()
	const setTreatmentStartDates = useSetTreatmentStartDatesState()
	const setTreatedUnits = useSetTreatedUnitsState()
	const setColumnMapping = useSetColumnMappingState()
	const setOutcomeName = useSetOutcomeNameState()
	const setEventName = useSetEventNameState()
	const setChartOptions = useSetChartOptionsState()

	return useCallback(
		({ fileName, content }: { fileName: string; content: string }) => {
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
				setTreatmentStartDatesAfterEstimate({
					tStartDates: treatmentStartDates,
				})
				setFileName('')
			}
		},
		[
			clearAllState,
			setRawData,
			setOutcomeName,
			updateColumnMapping,
			setTreatedUnits,
			setTreatmentStartDates,
			setChartOptions,
			setCheckedUnits,
			setEstimator,
			setTimeAlignment,
			setFilter,
			setOutputRes,
			setPlaceboSimulation,
			setTreatmentStartDatesAfterEstimate,
			setFileName,
			setEventName,
			setColumnMapping,
		],
	)
}
