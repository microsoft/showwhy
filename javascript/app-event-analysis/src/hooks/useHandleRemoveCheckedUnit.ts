/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { useCheckedUnitsState } from '../state/index.js'

export function useHandleRemoveCheckedUnit() {
	const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()

	return useCallback(
		(unitToRemove: string) => {
			const checkedUnitsCopy = new Set(checkedUnits)
			checkedUnitsCopy?.delete(unitToRemove)
			setCheckedUnits(checkedUnitsCopy)
		},
		[checkedUnits, setCheckedUnits],
	)
}
