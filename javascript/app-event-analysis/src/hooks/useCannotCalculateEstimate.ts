/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import {
	useColumnMappingValueState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesValueState,
} from '../state/index.js'
import {
	isValidColumnsMapping,
	isValidInput,
	isValidTreatedUnits,
	isValidTreatmentDates,
} from '../utils/validation.js'
import { useProcessedInputData } from './useProcessedInputData.js'

export function useCannotCalculateEstimate(isCalculatingEstimator: boolean) {
	const columnMapping = useColumnMappingValueState()
	const treatedUnits = useTreatedUnitsValueState()
	const treatmentStartDates = useTreatmentStartDatesValueState()
	const { data } = useProcessedInputData(columnMapping)
	const validInput = isValidInput(data)
	const validColumnsMapping = isValidColumnsMapping(columnMapping)
	const validTreatedUnits = isValidTreatedUnits(treatedUnits)
	const validTreatmentDates = isValidTreatmentDates(treatmentStartDates)
	// for the treated configuration,
	//  ensure that treatedUnits and treatmentStartDates are valid
	//  (note that unit-based placebo does not require a valid treatment date)
	// also, check that the input data is valid
	return useMemo(() => {
		const isInvalid = !(
			validInput &&
			validTreatmentDates &&
			validTreatedUnits &&
			validColumnsMapping
		)
		return isInvalid || isCalculatingEstimator
	}, [
		isCalculatingEstimator,
		validInput,
		validTreatmentDates,
		validTreatedUnits,
		validColumnsMapping,
	])
}
