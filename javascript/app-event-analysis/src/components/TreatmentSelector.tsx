/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, FontIcon, SpinButton, Stack } from '@fluentui/react'
import type { FormEvent, SyntheticEvent } from 'react'
import { memo, useCallback } from 'react'

import { isValidTreatmentDate, isValidUnit } from '../utils/validation.js'
import type { TreatmentSelectorProps } from './TreatmentSelector.types.js'

export const TreatmentSelector: React.FC<TreatmentSelectorProps> = memo(
	function TreatmentSelector({
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
				const unit = '' + optionKey
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
			[
				treatmentStartDate,
				onTreatmentDateChange,
				minDate,
				maxDate,
				treatedUnit,
			],
		)

		const onDeleteUnit = useCallback(
			(e: FormEvent, option?: IDropdownOption<string>) => {
				onDelete(treatedUnit)
			},
			[treatedUnit, onDelete],
		)

		return (
			<Stack
				horizontal
				tokens={{ childrenGap: 3 }}
				className="treatment-elements-container"
			>
				<Stack.Item grow className="treatment-element">
					<Dropdown
						className={!isValidUnit(treatedUnit) ? 'colInvalidSelection' : ''}
						placeholder="Subject (unit)"
						options={units.map(unit => ({ key: unit, text: unit }))}
						selectedKey={treatedUnit}
						onChange={onUnitChange}
					/>
				</Stack.Item>
				<Stack.Item grow className="treatment-element">
					<SpinButton
						className={
							!isValidTreatmentDate(treatmentStartDate)
								? 'colInvalidSelection'
								: ''
						}
						placeholder="Start date"
						value={treatmentStartDate.toString()}
						min={+minDate}
						max={+maxDate}
						step={1}
						onChange={onStartDateChange}
					/>
				</Stack.Item>
				<Stack.Item
					align="center"
					className="treatment-element"
					styles={{ root: { justifySelf: 'center' } }}
				>
					<FontIcon
						iconName="SkypeCircleMinus"
						className="remove-treated-unit"
						onClick={onDeleteUnit}
					/>
				</Stack.Item>
			</Stack>
		)
	},
)
