/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import {
	useColumnMappingValueState,
	useTreatmentStartDatesValueState,
} from '../state/index.js'
import {
	isValidPreTreatmentPeriods,
	isValidTreatmentDates,
} from '../utils/validation.js'
import { useCannotCalculateEstimate } from './useCannotCalculateEstimate.js'
import { useCannotCalculatePlacebo } from './useCannotCalculatePlacebo.js'
import { useProcessedInputData } from './useProcessedInputData.js'

export function useCheckCanExecuteEstimator(isCalculatingEstimator: boolean) {
	const columnMapping = useColumnMappingValueState()
	const treatmentStartDates = useTreatmentStartDatesValueState()
	const { data } = useProcessedInputData(columnMapping)
	const cannotCalculateEstimate = useCannotCalculateEstimate(
		isCalculatingEstimator,
	)
	const cannotCalculatePlacebo = useCannotCalculatePlacebo(
		isCalculatingEstimator,
	)
	const validTreatmentDates = isValidTreatmentDates(treatmentStartDates)
	const validPreTreatmentPeriods = isValidPreTreatmentPeriods(
		data,
		validTreatmentDates,
		treatmentStartDates,
	)
	return useCallback(() => {
		return !(
			(cannotCalculateEstimate && cannotCalculatePlacebo) ||
			!validPreTreatmentPeriods
		)
	}, [
		cannotCalculateEstimate,
		cannotCalculatePlacebo,
		validPreTreatmentPeriods,
	])
}
