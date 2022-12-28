/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useTreatedUnitsValueState } from '../state/index.js'

export type Map = { [unit: string]: number }

export function useTreatedUnitsMap(tu?: string[]): Map {
	const treatedUnits = useTreatedUnitsValueState()

	return useMemo(() => {
		const updatedMap: Map = {}
		;(tu || treatedUnits).forEach((unit: string) => {
			updatedMap[unit] = 1
		})
		return updatedMap
	}, [tu, treatedUnits])
}
