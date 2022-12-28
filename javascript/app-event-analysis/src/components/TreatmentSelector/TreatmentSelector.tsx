/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, FontIcon, Stack, Text } from '@fluentui/react'
import { uniq } from 'lodash'
import React, { memo, useCallback, useMemo } from 'react'

import {
	useTimeAlignmentState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesValueState,
} from '../../state/index.js'
import { Strong } from '../../styles/Styles.js'
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

		const treatedUnitList = useMemo<JSX.Element>(
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
			<Stack>
				{treatedUnits.length > MAX_RENDERED_TREATED_UNITS ? (
					<Stack horizontal className="unit-selection-header">
						<Stack.Item>
							<Text>
								Treated Units: <Strong>{treatedUnits.length}</Strong>
							</Text>
						</Stack.Item>
						<Stack.Item align="end">
							<FontIcon
								iconName="SkypeCircleMinus"
								className="remove-treated-unit"
								onClick={clearAllTreatedUnits}
							/>
						</Stack.Item>
					</Stack>
				) : (
					treatedUnitList
				)}
				<Stack.Item className="treatment-list"></Stack.Item>
				<Stack.Item align="center">
					<ActionButton
						iconProps={{ iconName: 'CirclePlus' }}
						className="add-treated-unit"
						onClick={addNewTreatedUnit}
						text="Add treated unit"
					/>
				</Stack.Item>
				<Stack.Item>
					{differentTreatmentPeriods && (
						<Stack tokens={{ childrenGap: 2 }} horizontal>
							<Stack.Item align="center" className="time-effect-label">
								<Text>Time Effect Heterogeneity:</Text>
							</Stack.Item>
							<Stack.Item grow={1} className="time-effect-selector">
								<TimeAlignmentSelector
									alignment={timeAlignment}
									onTimeAlignmentChange={handleTimeAlignmentChange}
								/>
							</Stack.Item>
						</Stack>
					)}
				</Stack.Item>
			</Stack>
		)
	},
)
