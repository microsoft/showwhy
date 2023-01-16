/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, FontIcon, Text } from '@fluentui/react'
import { uniq } from 'lodash'
import React, { memo, useCallback, useMemo } from 'react'

import {
	useTimeAlignmentState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesValueState,
} from '../../state/index.js'
import { Container, Strong } from '../../styles/index.js'
import { MAX_RENDERED_TREATED_UNITS } from '../../types.js'
import { TimeAlignmentSelector } from '../TimeAlignmentSelector.js'
import { Selector } from './Selector.js'
import {
	useAddNewTreatedUnit,
	useClearAllTreatedUnits,
	useHandleRemoveTreatmentUnit,
	useHandleTreatedUnitChange,
	useHandleTreatmentDateChange,
} from './TreatmentSelector.hooks.js'
import {
	ButtonWrapper,
	TreatedUnitWrapper,
} from './TreatmentSelector.styles.js'
import type { TreatmentSelectorProps } from './TreatmentSelector.types.js'

export const TreatmentSelector: React.FC<TreatmentSelectorProps> = memo(
	function TreatmentSelector({ data }) {
		const treatedUnits = useTreatedUnitsValueState()
		const treatmentStartDates = useTreatmentStartDatesValueState()
		const [timeAlignment, setTimeAlignment] = useTimeAlignmentState()
		const handleTimeAlignmentChange = useCallback(
			(newAlignment: string) => {
				setTimeAlignment(newAlignment)
			},
			[setTimeAlignment],
		)
		const handleTreatedUnitChange = useHandleTreatedUnitChange()
		const handleTreatmentDateChange = useHandleTreatmentDateChange()
		const handleRemoveTreatmentUnit = useHandleRemoveTreatmentUnit()
		const addNewTreatedUnit = useAddNewTreatedUnit(data)
		const clearAllTreatedUnits = useClearAllTreatedUnits()
		const differentTreatmentPeriods =
			treatmentStartDates.length > 0 && uniq(treatmentStartDates).length !== 1

		const treatedUnitList = useMemo<JSX.Element[]>(
			() =>
				treatedUnits.map((treatedUnit, index) => (
					<Selector
						key={treatedUnit}
						units={data.uniqueUnits}
						minDate={data.startDate}
						maxDate={data.endDate}
						onTreatedUnitChange={handleTreatedUnitChange}
						onTreatmentDateChange={handleTreatmentDateChange}
						treatmentStartDate={treatmentStartDates[index]}
						treatedUnit={treatedUnit}
						onDelete={handleRemoveTreatmentUnit}
					/>
				)),
			[
				data,
				treatedUnits,
				treatmentStartDates,
				handleTreatedUnitChange,
				handleTreatmentDateChange,
				handleRemoveTreatmentUnit,
			],
		)
		return (
			<Container>
				{treatedUnits.length > MAX_RENDERED_TREATED_UNITS ? (
					<TreatedUnitWrapper>
						<Text>
							Treated Units: <Strong>{treatedUnits.length}</Strong>
						</Text>
						<FontIcon
							iconName="SkypeCircleMinus"
							className="remove-treated-unit"
							onClick={clearAllTreatedUnits}
						/>
					</TreatedUnitWrapper>
				) : (
					treatedUnitList
				)}
				<ButtonWrapper>
					<ActionButton
						iconProps={{ iconName: 'CirclePlus' }}
						className="add-treated-unit"
						onClick={addNewTreatedUnit}
						text="Add treated unit"
					/>
				</ButtonWrapper>
				{differentTreatmentPeriods && (
					<TimeAlignmentSelector
						alignment={timeAlignment}
						onTimeAlignmentChange={handleTimeAlignmentChange}
					/>
				)}
			</Container>
		)
	},
)
