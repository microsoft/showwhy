/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MessageBarType } from '@fluentui/react'
import { useCallback } from 'react'

import {
	useColumnMappingValueState,
	useSetUserMessageState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesValueState,
} from '../state/index.js'
import {
	isValidColumnsMapping,
	isValidInput,
	isValidPreTreatmentPeriods,
	isValidTreatedUnits,
	isValidTreatmentDates,
} from '../utils/validation.js'
import { useProcessedInputData } from './useProcessedInputData.js'

export function useGenerateErrorMessage() {
	const columnMapping = useColumnMappingValueState()
	const setUserMessage = useSetUserMessageState()
	const treatedUnits = useTreatedUnitsValueState()
	const treatmentStartDates = useTreatmentStartDatesValueState()
	const { data, isDataLoaded } = useProcessedInputData(columnMapping)
	const validInput = isValidInput(data)
	const validColumnsMapping = isValidColumnsMapping(columnMapping)
	const validTreatedUnits = isValidTreatedUnits(treatedUnits)
	const validTreatmentDates = isValidTreatmentDates(treatmentStartDates)
	const validPreTreatmentPeriods = isValidPreTreatmentPeriods(
		data,
		validTreatmentDates,
		treatmentStartDates,
	)

	return useCallback(() => {
		let content = 'Unknown Error'
		if (!isDataLoaded)
			content = 'No data is loaded yet. Please load a valid dataset first!'
		if (!data.isBalancedPanelData)
			content =
				'Data is not in a balanced panel format. Please ensure that each unit has observations for ALL time periods!'
		if (!(validColumnsMapping && validInput))
			content =
				'Please ensure that Unit, Date, and Outcome have valid selections!'
		if (!validTreatedUnits)
			content = 'Please ensure that at least one treated unit is selected'
		if (!validTreatmentDates)
			content = 'Please ensure that at least one treatment period is selected'
		if (!validPreTreatmentPeriods)
			content =
				'Please ensure that pre-treatment periods for each treatment date has at least two time steps'

		setUserMessage({
			isVisible: true,
			content,
			type: MessageBarType.error,
		})
	}, [
		isDataLoaded,
		data,
		validColumnsMapping,
		validInput,
		validTreatedUnits,
		validTreatmentDates,
		validPreTreatmentPeriods,
		setUserMessage,
	])
}
