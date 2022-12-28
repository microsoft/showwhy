/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useCheckedUnitsValueState } from '../state/CheckedUnits.js'
import { useColumnMappingValueState } from '../state/ColumnMapping.js'
import { usePlaceboOutputResValueState } from '../state/PlaceboOutputRes.js'
import { useTreatedUnitsValueState } from '../state/TreatedUnits.js'
import { useTreatmentStartDatesAfterEstimateValueState } from '../state/TreatmentStartDatesAfterEstimate.js'
import type { PlaceboDataGroup, SDIDOutputResponse } from '../types.js'
import { computeRMSPE } from '../utils/computeRMSPE.js'
import { useProcessedInputData } from './useProcessedInputData.js'

export function usePlaceboDataGroup(): Map<string, PlaceboDataGroup[]> {
	const treatedUnits = useTreatedUnitsValueState()
	const checkedUnits = useCheckedUnitsValueState()
	const columnMapping = useColumnMappingValueState()
	const placeboOutputRes = usePlaceboOutputResValueState()
	const treatmentStartDatesAfterEstimate =
		useTreatmentStartDatesAfterEstimateValueState()

	const { data } = useProcessedInputData(columnMapping)

	return useMemo(() => {
		const map = new Map<string, PlaceboDataGroup[]>()
		treatedUnits.forEach((treatedUnit: string) => {
			const output = computeRMSPE(
				placeboOutputRes.get(treatedUnit) as SDIDOutputResponse,
				data.startDate,
				data.endDate,
				treatmentStartDatesAfterEstimate,
				[treatedUnit],
				checkedUnits,
			)
			map.set(treatedUnit, output)
		})
		return map
	}, [
		data,
		treatmentStartDatesAfterEstimate,
		checkedUnits,
		treatedUnits,
		placeboOutputRes,
	])
}
