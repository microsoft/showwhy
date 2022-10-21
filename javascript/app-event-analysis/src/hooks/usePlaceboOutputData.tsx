/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useRecoilState } from 'recoil'

import { PlaceboOutputResState, TreatedUnitsState } from '../state/state.js'
import type {
	OutputData,
	PlaceboOutputData,
	SDIDOutputResponse,
} from '../types.js'
import { processOutputData } from '../utils/processOutputData.js'
import { useTreatedUnitsMap } from './useTreatedUnitsMap.js'

export function usePlaceboOutputData(): Map<
	string,
	(OutputData | PlaceboOutputData)[]
> {
	const [treatedUnits] = useRecoilState(TreatedUnitsState)
	const [placeboOutputRes] = useRecoilState(PlaceboOutputResState)
	const treatedUnitsMap = useTreatedUnitsMap()

	return useMemo(() => {
		const map = new Map<string, (OutputData | PlaceboOutputData)[]>()
		treatedUnits.forEach((treatedUnit: string) => {
			const output = placeboOutputRes.get(
				treatedUnit,
			) as SDIDOutputResponse | null
			const data = processOutputData(output, treatedUnitsMap)
			map.set(treatedUnit, data)
		})
		return map
	}, [placeboOutputRes, treatedUnitsMap, treatedUnits])
}
