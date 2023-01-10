/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { ProcessedInputData } from '../types.js'
import { useTreatedUnitsMap } from './useTreatedUnitsMap.js'

export function useUnitCheckboxListItems(data: ProcessedInputData) {
	const treatedUnitsMap = useTreatedUnitsMap()

	return useMemo(
		() =>
			data.uniqueUnits
				.filter((unit: string) => !treatedUnitsMap[unit])
				.map((unit: string) => ({ name: unit })),
		[data.uniqueUnits, treatedUnitsMap],
	)
}
