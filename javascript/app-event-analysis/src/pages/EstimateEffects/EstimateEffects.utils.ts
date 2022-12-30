/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	OutputData,
	PlaceboOutputData,
	SynthControlData,
	SyntheticControlUnit,
} from '../../types.js'

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
