/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'

import { useUnitCheckboxListItems } from '../../../hooks/useChekeableUnits.js'
import {
	useCheckedUnitsState,
	useCheckedUnitsValueState,
	useTreatedUnitsValueState,
} from '../../../state/index.js'
import type { ProcessedInputData } from '../../../types.js'
import { isValidTreatedUnits } from '../../../utils/validation.js'

export function useControlUnitsIntermediateChecked(data: ProcessedInputData) {
	const checkedUnits = useCheckedUnitsValueState()
	const treatedUnits = useTreatedUnitsValueState()
	const unitCheckboxListItems = useUnitCheckboxListItems(data)
	const validTreatedUnits = isValidTreatedUnits(treatedUnits)

	return useMemo(() => {
		return checkedUnits
			? (validTreatedUnits
					? checkedUnits.size - treatedUnits.length !==
					  unitCheckboxListItems.length
					: checkedUnits.size !== unitCheckboxListItems.length) &&
					checkedUnits.size !== 0
			: false
	}, [checkedUnits, validTreatedUnits, unitCheckboxListItems, treatedUnits])
}

export function useHandleSelectAllUnits(data: ProcessedInputData) {
	const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()
	const treatedUnits = useTreatedUnitsValueState()
	const unitCheckboxListItems = useUnitCheckboxListItems(data)
	const validTreatedUnits = isValidTreatedUnits(treatedUnits)

	return useCallback(() => {
		if (checkedUnits !== null && data.uniqueUnits.length) {
			const checkedUnitCount = validTreatedUnits
				? checkedUnits.size - treatedUnits.length
				: checkedUnits.size
			if (checkedUnitCount === unitCheckboxListItems.length) {
				// all units are checked, then de-select all
				setCheckedUnits(new Set([]))
			} else {
				// select all units
				setCheckedUnits(new Set(data.uniqueUnits))
			}
		}
	}, [
		data,
		checkedUnits,
		unitCheckboxListItems,
		validTreatedUnits,
		treatedUnits,
		setCheckedUnits,
	])
}
