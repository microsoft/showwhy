/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BarData, PlaceboOutputData } from '../../types.js'

export function getTreatedPlaceboIndex(
	treatedUnit: string,
	placeboBarChartInputData: BarData[],
): number {
	const len = placeboBarChartInputData.length
	return (
		len -
		placeboBarChartInputData.findIndex(
			(placebo: BarData) => placebo.name === treatedUnit,
		)
	)
}

export function getSdidEstimate(
	treatedUnit: string,
	output: PlaceboOutputData,
): number {
	const index =
		output.output_lines_treated.findIndex(l =>
			l[0].unit.includes(treatedUnit),
		) ?? -1
	return index >= 0 ? output.sdid_estimates[index] : 0
}
