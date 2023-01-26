/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MessageBarType } from '@fluentui/react'
import { cloneDeep, isEmpty } from 'lodash'
import { useCallback } from 'react'

import API from '../api.js'
import {
	useCheckedUnitsValueState,
	useEstimatorValueState,
	useOutputResResetState,
	usePlaceboOutputResResetState,
	useSetChartOptionsState,
	useSetOutputResState,
	useSetPlaceboOutputResState,
	useSetPlaceboSimulationState,
	useSetTreatmentStartDatesAfterEstimateState,
	useSetUserMessageState,
	useTimeAlignmentValueState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesValueState,
} from '../state/index.js'
import type { ProcessedInputData, SDIDOutputResponse } from '../types.js'
import { useCheckCanExecuteEstimator } from './useCheckCanExecuteEstimator.js'
import { useTreatedUnitsMap } from './useTreatedUnitsMap.js'

//
// To evaluate the significance of our estimates, we pose the
//  question of whether our results could be driven entirely by chance.
//  How often would we obtain results of this magnitude if we had
//  chosen a unit at random for the study instead of the treated unit (e.g., California)?
//  To answer this question, we use placebo tests
//
export function useCalculateEstimate(
	data: ProcessedInputData,
	isCalculatingEstimator: boolean,
	setIsLoading: (value: boolean) => void,
) {
	const estimator = useEstimatorValueState()
	const setUserMessage = useSetUserMessageState()
	const checkedUnits = useCheckedUnitsValueState()
	const treatedUnits = useTreatedUnitsValueState()
	const timeAlignment = useTimeAlignmentValueState()
	const setPlaceboSimulation = useSetPlaceboSimulationState()
	const treatmentStartDates = useTreatmentStartDatesValueState()
	const setOutputRes = useSetOutputResState()
	const resetOutputRes = useOutputResResetState()
	const setChartOptions = useSetChartOptionsState()
	const setPlaceboOutputRes = useSetPlaceboOutputResState()
	const resetPlaceboOutputRes = usePlaceboOutputResResetState()
	const setTreatmentStartDatesAfterEstimate =
		useSetTreatmentStartDatesAfterEstimateState()
	const treatedUnitsMap = useTreatedUnitsMap()
	const checkCanExecuteEstimator = useCheckCanExecuteEstimator(
		isCalculatingEstimator,
	)

	return useCallback(
		async (placebo = false, treatedUnitsList: string[] = treatedUnits) => {
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
			setIsLoading(true)

			// filter input data according to unit selection, and include the treated units
			let filteredInputData = data.dataPoints
				.filter((dp) => checkedUnits?.has(dp.unit) || treatedUnitsMap[dp.unit])
				.map(({ unit, date, value, treated }) => {
					// Make sure data point only includes value, date, unit, treated field
					return { unit, date, value, treated }
				})

			if (placebo) {
				filteredInputData = filteredInputData.filter(
					(i) =>
						i.unit === treatedUnitsList[0] || !treatedUnits.includes(i.unit),
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

			setIsLoading(false)

			// result will always come back as an array
			const outputsResponse: SDIDOutputResponse | null =
				calculationError === null && res ? res.data : null
			const outputs =
				outputsResponse?.outputs.map((outputResult) => outputResult.output) ??
				[]
			if (outputs.every((output) => isEmpty(output))) {
				let errorMsg = 'Error calculating output for the provided input!'
				if (calculationError !== null)
					errorMsg += '\n' + (calculationError as Error).message
				setUserMessage({
					isVisible: true,
					content: errorMsg,
					type: MessageBarType.error,
				})
				resetOutputRes()
				resetPlaceboOutputRes()
				return
			}
			setUserMessage({
				isVisible: false,
				content: '',
			})
			if (placebo) {
				setPlaceboOutputRes((prev) => {
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
			setChartOptions((prev) => ({
				...prev,
				renderRawData: false,
				showSynthControl: true,
			}))
		},
		[
			checkCanExecuteEstimator,
			checkedUnits,
			data.dataPoints,
			estimator,
			setChartOptions,
			setIsLoading,
			setOutputRes,
			setPlaceboOutputRes,
			setPlaceboSimulation,
			setTreatmentStartDatesAfterEstimate,
			setUserMessage,
			timeAlignment,
			treatedUnits,
			treatedUnitsMap,
			treatmentStartDates,
			resetPlaceboOutputRes,
			resetOutputRes,
		],
	)
}
