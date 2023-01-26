/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	OutputData,
	OutputDataPoint,
	PlaceboOutputData,
	SDIDOutputResponse,
} from '../types.js'
import { getOutputPoints } from './getOutpoutPoints.js'

export function processOutputData(
	outputRes: SDIDOutputResponse | null,
	treatedUnitsMap: { [unit: string]: number },
) {
	if (!outputRes) return [] as (OutputData | PlaceboOutputData)[]

	const {
		outputs,
		compute_placebos: isPlacebos,
		consistent_time_window,
		time_mapping_applied,
	} = outputRes

	const output_data: (OutputData | PlaceboOutputData)[] = []

	// NOTE: by defining arrays (which mainly needed to render the output lines) outside the loop,
	//       it means the output lines for all treated units will be in a single (or each) chart
	const outputTreated: OutputDataPoint[][] = []
	const outputControl: OutputDataPoint[][] = []
	const interceptOffsets: number[] = []
	const sdidEstimates: number[] = []

	//
	// placebo results are always rendered in a single chart
	//  (i.e., a single entry in the output_data array)
	//
	if (isPlacebos) {
		let treatedUnits = ''
		outputs.forEach((outputResult) => {
			const { controlPoints, treatedPoints } = getOutputPoints(outputResult)
			const output = outputResult.output
			outputTreated.push(treatedPoints)
			outputControl.push(controlPoints)
			interceptOffsets.push(output.intercept_offset)
			sdidEstimates.push(Number(output.sdid_estimate.toFixed(2)))
			treatedUnits += `${outputResult.unit} `
		})
		output_data.push({
			output_lines_treated: outputTreated,
			output_lines_control: outputControl,
			intercept_offset: interceptOffsets,
			treatedUnit: treatedUnits,
			sdid_estimates: sdidEstimates,
		})
	} else {
		// prepare result for treatment effect for all units individually or combined
		//  TODO: utilize a user driven flag to render the output from all units in one chart
		//        or to prepare data to render a chart for each unit

		// For now: we combine the output from all treated units into one array/chart

		outputs
			.filter((output) => treatedUnitsMap[output.unit])
			.forEach((outputResult) => {
				const { controlPoints, treatedPoints } = getOutputPoints(outputResult)
				const output = outputResult.output

				outputTreated.push(treatedPoints)
				outputControl.push(controlPoints)
				interceptOffsets.push(output.intercept_offset)

				output_data.push({
					output_lines_treated: outputTreated,
					output_lines_control: outputControl,
					sdid_estimate: Number(output.sdid_estimate.toFixed(2)),
					time_before_intervention: Math.floor(output.time_before_intervention),
					time_after_intervention: Math.floor(output.time_after_intervention),
					treated_pre_value: output.treated_pre_value,
					treated_post_value: output.treated_post_value,
					control_pre_value: output.control_pre_value,
					control_post_value: output.control_post_value,
					intercept_offset: interceptOffsets,
					counterfactual_value: output.counterfactual_value,
					weighted_synthdid_controls: output.weighted_synthdid_controls,
					treatedUnit: outputResult.unit,
					consistent_time_window: consistent_time_window,
					time_mapping_applied: time_mapping_applied,
				})
			})
	}

	return output_data
}
