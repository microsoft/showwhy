/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import {
	useSelectedTabKeyValueState,
	useTreatedUnitsValueState,
} from '../state/index.js'
import { CONFIGURATION_TABS } from '../types.js'
import { usePlaceboDataGroup } from './usePlaceboDataGroup.js'
import { usePlaceboOutputData } from './usePlaceboOutputData.js'

export function useShowPlaceboGraphs() {
	const treatedUnits = useTreatedUnitsValueState()
	const selectedTabKey = useSelectedTabKeyValueState()
	const placeboOutputData = usePlaceboOutputData()
	const placeboDataGroup = usePlaceboDataGroup()

	return useMemo((): boolean => {
		const hasOutput = treatedUnits.some(
			(tu: string) => (placeboOutputData.get(tu)?.length ?? 0) > 0,
		)
		const hasDataGroup = treatedUnits.some(
			(tu: string) => (placeboDataGroup.get(tu)?.length ?? 0) > 0,
		)
		return (
			hasOutput &&
			hasDataGroup &&
			selectedTabKey === CONFIGURATION_TABS.validateEffects.key
		)
	}, [placeboDataGroup, placeboOutputData, treatedUnits, selectedTabKey])
}
