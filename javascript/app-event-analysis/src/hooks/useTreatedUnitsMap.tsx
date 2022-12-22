/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useRecoilState } from 'recoil'

import { TreatedUnitsState } from '../state/state.js'

export type Map = { [unit: string]: number }

export function useTreatedUnitsMap(tu?: string[]): Map {
	const [treatedUnits] = useRecoilState(TreatedUnitsState)

	return useMemo(() => {
		const updatedMap: Map = {}
		;(tu || treatedUnits).forEach((unit: string) => {
			updatedMap[unit] = 1
		})
		return updatedMap
	}, [tu, treatedUnits])
}
