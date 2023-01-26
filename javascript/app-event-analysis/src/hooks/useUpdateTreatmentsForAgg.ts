/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import {
	useTreatedUnitsValueState,
	useTreatmentStartDatesValueState,
} from '../state/index.js'
import type { Treatment } from '../types.js'

export function useUpdateTreatmentsForAgg(
	defaultTreatment: Treatment | null,
	updateTreatmentsForAggregation: (treatment: Treatment) => void,
) {
	const treatmentStartDates = useTreatmentStartDatesValueState()
	const treatedUnits = useTreatedUnitsValueState()
	return useCallback(() => {
		// Construct treatment including group info
		const treatment: Treatment = {
			units: treatedUnits,
			startDates: treatmentStartDates,
			groups: {},
		}
		// Extract grouped units information
		treatedUnits.forEach((unit) => {
			const groupedUnits = defaultTreatment?.groups[unit]
			if (groupedUnits) {
				treatment.groups[unit] = groupedUnits
			}
		})
		updateTreatmentsForAggregation(treatment)
	}, [
		treatedUnits,
		treatmentStartDates,
		defaultTreatment?.groups,
		updateTreatmentsForAggregation,
	])
}
