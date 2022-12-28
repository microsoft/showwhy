/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useOutputResValueState } from '../state/index.js'
import type { OutputData, PlaceboOutputData } from '../types.js'
import { processOutputData } from '../utils/processOutputData.js'
import { useTreatedUnitsMap } from './useTreatedUnitsMap.js'

export function useOutputData(): (OutputData | PlaceboOutputData)[] {
	const treatedUnitsMap = useTreatedUnitsMap()
	const outputRes = useOutputResValueState()

	return useMemo(
		() => processOutputData(outputRes, treatedUnitsMap),
		[outputRes, treatedUnitsMap],
	)
}
