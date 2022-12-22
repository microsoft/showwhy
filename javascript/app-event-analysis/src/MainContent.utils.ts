/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable  @typescript-eslint/ban-ts-comment */

import type {
	ColumnMapping,
	EstimatorsKeyString as EstimatorsString,
	OutputData,
	PlaceboOutputData,
	SynthControlData,
	SyntheticControlUnit,
} from './types'
import { Estimators, POSSIBLE_COL_NAMES } from './types'

export function guessColMapping(columns: string[]): ColumnMapping {
	// NOTE: the use of 'unit', 'Unit', or 'State' as possible column names
	//  Such code is used in an attempt to guess and automatically set the unitColSelection
	//  from the input data, and thus saves the user the need to explicitly select that
	const unit =
		columns.find(colName => POSSIBLE_COL_NAMES.unit.includes(colName)) || ''
	const date =
		columns.find(colName => POSSIBLE_COL_NAMES.date.includes(colName)) || ''
	const treated =
		columns.find(colName => POSSIBLE_COL_NAMES.treated.includes(colName)) || ''
	const value =
		columns.find(colName => POSSIBLE_COL_NAMES.value.includes(colName)) || ''
	return {
		unit,
		date,
		treated,
		value,
	}
}

export function getEstimatorLabel(key: EstimatorsString) {
	return Estimators[key]
}

export function processSynthControlData(
	allOutputData: (OutputData | PlaceboOutputData)[],
	checkedUnits: Set<string> | null,
) {
	// extract synth controls for the output from each treated unit
	const synthControlData: SynthControlData = {}

	allOutputData.forEach(oData => {
		const outputData = oData as OutputData
		const treatedUnit = outputData.treatedUnit
		const scWeightedUnits: SyntheticControlUnit[] = []

		if (outputData.weighted_synthdid_controls) {
			const scWeights = outputData.weighted_synthdid_controls.weights
			let scUnits = outputData.weighted_synthdid_controls.dimnames
			// When there's only one unit returning, the API returns it as a string and we're expecting an array of strings
			if (typeof scUnits === 'string') {
				scUnits = [scUnits]
			}
			scUnits.forEach((unit, indx) => {
				if (checkedUnits !== null && checkedUnits.has(unit)) {
					const weight = scWeights[indx]
					scWeightedUnits.push({ unit, weight })
				}
			})
		}

		synthControlData[treatedUnit] = scWeightedUnits
	})

	return synthControlData
}
