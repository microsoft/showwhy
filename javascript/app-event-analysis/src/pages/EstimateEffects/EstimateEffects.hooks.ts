/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MessageBarType } from '@fluentui/react'
import { isEqual } from 'lodash'
import { useCallback, useMemo } from 'react'

import { useTreatedUnitsMap } from '../../hooks/useTreatedUnitsMap.js'
import {
	useSetChartOptionsState,
	useSetFilterState,
	useSetOutputResState,
	useSetTreatmentStartDatesAfterEstimateState,
	useSetUserMessageState,
	useTreatmentStartDatesState,
} from '../../state/index.js'
import type { ProcessedInputData } from '../../types.js'

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
			treatmentStartDates.forEach((date) => {
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
			setChartOptions((prev) => ({
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
