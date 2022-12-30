/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isEmpty } from 'lodash'

import type { ColumnMapping, ProcessedInputData } from '../types.js'
import { POSSIBLE_COL_NAMES } from '../types.js'

const MIN_PRE_TREATMENT_TIME_PERIODS = 2

export const isValidUnit = (unit: string) => {
	return unit !== ''
}

export const isValidTreatmentDate = (treatmentDate: number) => {
	return treatmentDate !== 0
}

export function isValidColumnsMapping(columnMapping: ColumnMapping): boolean {
	const notValid = Object.keys(POSSIBLE_COL_NAMES).some(
		colName => colName !== 'treated' && columnMapping[colName] === '',
	)
	return !notValid
}

export function isValidInput(data: ProcessedInputData): boolean {
	return !isEmpty(data.dataPoints) || !data.isBalancedPanelData
}

export function isValidTreatedUnits(treatedUnits: string[]): boolean {
	return (
		treatedUnits.length > 0 && treatedUnits.every(unit => isValidUnit(unit))
	)
}

export function isValidTreatmentDates(treatmentStartDates: number[]): boolean {
	return (
		treatmentStartDates.length > 0 &&
		treatmentStartDates.every(isValidTreatmentDate)
	)
}

// synthdid requires at least two time steps for the pre-treatment periods
// see https://github.com/synth-inference/synthdid/issues/78
export function isValidPreTreatmentPeriods(
	data: ProcessedInputData,
	validTreatmentDates: boolean,
	treatmentStartDates: number[],
): boolean {
	const isPreValidTreatmentDate = (treatmentDate: number) => {
		return treatmentDate - data.startDate >= MIN_PRE_TREATMENT_TIME_PERIODS
	}
	return (
		validTreatmentDates && treatmentStartDates.every(isPreValidTreatmentDate)
	)
}
