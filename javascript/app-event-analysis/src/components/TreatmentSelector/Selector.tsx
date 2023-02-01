/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, FontIcon, SpinButton } from '@fluentui/react'
import type { FormEvent, SyntheticEvent } from 'react'
import { memo, useCallback } from 'react'

import { SelectorContainer } from './Selector.styles.js'
import type { SelectorProps } from './Selector.types.js'

export const Selector: React.FC<SelectorProps> = memo(function Selector({
	units,
	minDate,
	maxDate,
	treatmentStartDate,
	treatedUnit,
	onTreatmentDateChange,
	onTreatedUnitChange,
	onDelete,
}) {
	const onUnitChange = useCallback(
		(e: FormEvent, option?: IDropdownOption<string>) => {
			const optionKey = option ? (option.key as string) : ''
			const unit = `${optionKey}`
			if (treatedUnit === unit) return
			onTreatedUnitChange(treatedUnit, unit)
		},
		[treatedUnit, onTreatedUnitChange],
	)

	const onStartDateChange = useCallback(
		(e: SyntheticEvent, newVal?: string) => {
			let val = Number(newVal || '0')
			if (val < minDate) val = Number(minDate)
			if (val > maxDate) val = Number(maxDate)
			if (treatmentStartDate === val) return
			onTreatmentDateChange(val, treatedUnit)
		},
		[treatmentStartDate, onTreatmentDateChange, minDate, maxDate, treatedUnit],
	)

	const onDeleteUnit = useCallback(
		(e: FormEvent, option?: IDropdownOption<string>) => {
			onDelete(treatedUnit)
		},
		[treatedUnit, onDelete],
	)

	return (
		<SelectorContainer>
			<Dropdown
				placeholder="Treated unit"
				options={units.map((unit) => ({ key: unit, text: unit }))}
				selectedKey={treatedUnit}
				onChange={onUnitChange}
			/>
			<SpinButton
				placeholder="Start date"
				value={treatmentStartDate.toString()}
				min={+minDate}
				max={+maxDate}
				step={1}
				onChange={onStartDateChange}
			/>
			<FontIcon
				iconName="SkypeCircleMinus"
				className="remove-treated-unit"
				onClick={onDeleteUnit}
			/>
		</SelectorContainer>
	)
})
