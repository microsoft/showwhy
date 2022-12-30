/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MessageBarType } from '@fluentui/react'
import { isEqual } from 'lodash'
import { useCallback, useMemo } from 'react'

import { useUnitCheckboxListItems } from '../../hooks/useChekeableUnits.js'
import { useTreatedUnitsMap } from '../../hooks/useTreatedUnitsMap.js'
import {
	useCheckedUnitsState,
	useCheckedUnitsValueState,
	useSetChartOptionsState,
	useSetFilterState,
	useSetOutputResState,
	useSetTreatmentStartDatesAfterEstimateState,
	useSetUserMessageState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesState,
} from '../../state/index.js'
import type { ProcessedInputData } from '../../types.js'
import { isValidTreatedUnits } from '../../utils/validation.js'

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

export function useResetDataHandler(isDataLoaded: boolean) {
	const setFilter = useSetFilterState()
	const setOutputRes = useSetOutputResState()
	const setUserMessage = useSetUserMessageState()

	return useCallback(() => {
		if (!isDataLoaded) {
			setUserMessage({
				isVisible: true,
				content: 'No data is loaded yet. Please load a valid dataset first!',
				type: MessageBarType.error,
			})
			return
		}
		setFilter(null)
		// we have just invalidated the input,
		// so the existing output should be ignored or better yet back to the input view
		setOutputRes(null)
	}, [isDataLoaded, setFilter, setOutputRes, setUserMessage])
}

export function useFilterDataHandler(isDataLoaded: boolean) {
	const setFilter = useSetFilterState()
	const setOutputRes = useSetOutputResState()
	const setUserMessage = useSetUserMessageState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()
	const setChartOptions = useSetChartOptionsState()
	const setTreatmentStartDatesAfterEstimate =
		useSetTreatmentStartDatesAfterEstimateState()

	return useCallback(
		(filterRange: [number, number]) => {
			if (!isDataLoaded) {
				setUserMessage({
					isVisible: true,
					content: 'No data is loaded yet. Please load a valid dataset first!',
					type: MessageBarType.error,
				})
				return
			}
			const [startDate, endDate] = filterRange
			// pretend a new treatment start date as the middle of the pre-treatment range
			//  and update the data accordingly
			const placeboTreatmentStartDate = Math.floor(
				startDate + (endDate - startDate) / 2,
			)
			// if any of the treatment start dates outside the date range of the date,
			//  move it to the middle of the data range
			const tempDate: number[] = []
			treatmentStartDates.forEach(date => {
				if (date <= startDate || date >= endDate) {
					tempDate.push(placeboTreatmentStartDate)
				} else {
					tempDate.push(date)
				}
			})
			if (!isEqual(treatmentStartDates, tempDate)) {
				setTreatmentStartDates(tempDate)
			}

			setFilter({ startDate, endDate })

			// we have just invalidated the input,
			// so the existing output should be ignored or better yet back to the input view
			setOutputRes(null)
			setTreatmentStartDatesAfterEstimate(null)
			//  automatically un-toggle the raw input and hide the synth control and counterfactual
			setChartOptions(prev => ({
				...prev,
				renderRawData: true,
				showSynthControl: false,
			}))
		},
		[
			isDataLoaded,
			setFilter,
			setOutputRes,
			setUserMessage,
			setChartOptions,
			treatmentStartDates,
			setTreatmentStartDates,
			setTreatmentStartDatesAfterEstimate,
		],
	)
}

export function useMultiDropdownOptions(data: ProcessedInputData) {
	const treatedUnitsMap = useTreatedUnitsMap()

	return useMemo(
		() =>
			data.uniqueUnits
				.filter((unit: string) => !treatedUnitsMap[unit])
				.map((unit: string) => ({ text: unit, key: unit })),
		[data.uniqueUnits, treatedUnitsMap],
	)
}
