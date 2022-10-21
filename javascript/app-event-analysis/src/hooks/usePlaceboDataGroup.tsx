/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useRecoilState } from 'recoil'

import {
	CheckedUnitsState,
	ColumnMappingState,
	PlaceboOutputResState,
	TreatedUnitsState,
	TreatmentStartDatesAfterEstimateState,
} from '../state/state.js'
import type { PlaceboDataGroup, SDIDOutputResponse } from '../types.js'
import { computeRMSPE } from '../utils/computeRMSPE.js'
import { useProcessedInputData } from './useProcessedInputData.js'

export function usePlaceboDataGroup(): Map<string, PlaceboDataGroup[]> {
	const [treatedUnits] = useRecoilState(TreatedUnitsState)
	const [checkedUnits] = useRecoilState(CheckedUnitsState)
	const [columnMapping] = useRecoilState(ColumnMappingState)
	const [placeboOutputRes] = useRecoilState(PlaceboOutputResState)
	const [treatmentStartDatesAfterEstimate] = useRecoilState(
		TreatmentStartDatesAfterEstimateState,
	)

	const { data } = useProcessedInputData(columnMapping)

	return useMemo(() => {
		const map = new Map()
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
