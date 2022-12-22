/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isEmpty } from 'lodash'
import { useMemo } from 'react'

import type { OutputData, PlaceboOutputData } from '../types.js'

export function useTreatmentDates(
	outputData: (OutputData | PlaceboOutputData)[],
	isPlaceboSimulation: boolean,
	treatmentStartDates: number[],
) {
	const firstOutput = useMemo(
		() =>
			outputData.length > 0
				? outputData[0]
				: ({} as OutputData | PlaceboOutputData),
		[outputData],
	)
	return useMemo(() => {
		const dates = Array.from(treatmentStartDates)
		const outputDataNonPlacebo = firstOutput as OutputData
		const dataShiftedAndAligned =
			!isEmpty(outputDataNonPlacebo) &&
			outputDataNonPlacebo.time_mapping_applied

		const isTreatment =
			!isPlaceboSimulation &&
			dataShiftedAndAligned &&
			!isEmpty(outputDataNonPlacebo) &&
			outputDataNonPlacebo.consistent_time_window != null

		if (isTreatment) {
			const treatmentDate = outputDataNonPlacebo
				.consistent_time_window?.[0] as number
			dates.forEach((_, index) => {
				dates[index] = treatmentDate
			})
		}
		return dates
	}, [treatmentStartDates, firstOutput, isPlaceboSimulation])
}
