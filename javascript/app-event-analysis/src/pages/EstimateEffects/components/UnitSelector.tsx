/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MultiDropdown } from '@essex/components'
import { type IDropdownOption, Checkbox } from '@fluentui/react'
import React, { type FormEvent, memo, useCallback, useMemo } from 'react'

import { useUnitCheckboxListItems } from '../../../hooks/useChekeableUnits.js'
import {
	useCheckedUnitsState,
	useTreatedUnitsValueState,
} from '../../../state/index.js'
import { Container, StepDescription, StepTitle } from '../../../styles/index.js'
import type { ProcessedInputData } from '../../../types.js'
import { isValidTreatedUnits } from '../../../utils/validation.js'
import { useMultiDropdownOptions } from '../EstimateEffects.hooks.js'
import {
	useControlUnitsIntermediateChecked,
	useHandleSelectAllUnits,
} from './UnitSelector.hooks.js'

interface UnitSelectorProps {
	data: ProcessedInputData
}

export const UnitSelector: React.FC<UnitSelectorProps> = memo(
	function UnitSelector({ data }) {
		const treatedUnits = useTreatedUnitsValueState()
		const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()
		const validTreatedUnits = isValidTreatedUnits(treatedUnits)
		const unitCheckboxListItems = useUnitCheckboxListItems(data)
		const controlUnitsIntermediateChecked =
			useControlUnitsIntermediateChecked(data)
		const handleSelectAllUnits = useHandleSelectAllUnits(data)
		const options = useMultiDropdownOptions(data)

		const controlUnitsChecked = useMemo(() => {
			return checkedUnits
				? validTreatedUnits
					? checkedUnits.size - treatedUnits.length ===
					  unitCheckboxListItems.length
					: checkedUnits.size === unitCheckboxListItems.length
				: false
		}, [checkedUnits, validTreatedUnits, unitCheckboxListItems, treatedUnits])

		const onChange = useCallback(
			(_: FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
				setCheckedUnits((prev) => {
					const set = new Set(prev || [])
					if (!option) return set
					if (set.has(option.key as string)) {
						set.delete(option.key as string)
					} else {
						set.add(option.key as string)
					}
					return set
				})
			},
			[setCheckedUnits],
		)

		const onChangeAll = useCallback(
			(_: React.MouseEvent, options?: IDropdownOption[]) => {
				setCheckedUnits(
					options?.length ? new Set(options.map((o) => o.key as string)) : null,
				)
			},
			[setCheckedUnits],
		)

		return (
			<Container>
				<Container>
					<StepTitle>Unit selection</StepTitle>
					<Checkbox
						label="Select All/None"
						checked={controlUnitsChecked}
						indeterminate={controlUnitsIntermediateChecked}
						onChange={handleSelectAllUnits}
					/>
				</Container>
				<StepDescription>
					Include or exclude units from the pool of data that can be used to
					generate our synthetic control.
				</StepDescription>
				<MultiDropdown
					selectedKeys={Array.from(checkedUnits || [])}
					options={options}
					onChange={onChange}
					onChangeAll={onChangeAll}
				/>
			</Container>
		)
	},
)
