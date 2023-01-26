/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import {
	useColumnMappingValueState,
	useTreatmentStartDatesValueState,
} from '../state/index.js'
import {
	isValidColumnsMapping,
	isValidInput,
	isValidTreatmentDates,
} from '../utils/validation.js'
import { useProcessedInputData } from './useProcessedInputData.js'

export function useCannotCalculatePlacebo(isCalculatingEstimator: boolean) {
	const columnMapping = useColumnMappingValueState()
	const treatmentStartDates = useTreatmentStartDatesValueState()
	const { data } = useProcessedInputData(columnMapping)
	const validInput = isValidInput(data)
	const validColumnsMapping = isValidColumnsMapping(columnMapping)
	const validTreatmentDates = isValidTreatmentDates(treatmentStartDates)
	// for the treated configuration,
	//  ensure that treatmentStartDates are valid
	//  (note that varying-unit placebo does not require a valid treated unit)
	// also, check that the input data is valid
	return useMemo(() => {
		const isInvalid = !(
			validInput &&
			validTreatmentDates &&
			validColumnsMapping
		)
		return isInvalid || isCalculatingEstimator
	}, [
		isCalculatingEstimator,
		validInput,
		validColumnsMapping,
		validTreatmentDates,
	])
}
