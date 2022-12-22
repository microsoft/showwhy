/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { mean } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import {
	TreatedUnitsState,
	TreatmentStartDatesState,
} from '../../state/state.js'
import type { OutputData, ProcessedInputData } from '../../types.js'
import { TimeAlignmentOptions } from '../../types.js'
import { getKeyByValue, weightedMean } from '../../utils/misc.js'

export function useHeaderText(timeAlignment: string, firstOutput: OutputData) {
	const treatedUnits = useRecoilValue(TreatedUnitsState)
	return useMemo<string>(() => {
		if (!firstOutput) return ''
		const { time_before_intervention, time_after_intervention } = firstOutput
		if (
			treatedUnits.length > 1 &&
			timeAlignment === getKeyByValue(TimeAlignmentOptions.Staggered_Design)
		) {
			return 'The algorithm has selected a different time range according to the treatment period of each unit to measure the effect'
		}
		return `The algorithm has selected ${time_before_intervention}-${time_after_intervention} as the time range for measuring effects.`
	}, [treatedUnits, timeAlignment, firstOutput])
}

export function useMeanTreatmentEffect(
	inputData: ProcessedInputData,
	timeAlignment: string,
	outputDataNonPlacebo: OutputData[],
) {
	const treatmentStartDates = useRecoilValue(TreatmentStartDatesState)
	return useMemo<string>(() => {
		if (!outputDataNonPlacebo.length) return ''
		if (
			timeAlignment !== getKeyByValue(TimeAlignmentOptions.Staggered_Design)
		) {
			return mean(
				outputDataNonPlacebo.map((output: OutputData) => output.sdid_estimate),
			).toFixed(2)
		} else {
			const treatmentEndDate = inputData.endDate
			const treatmentDateOffsets: number[] = []
			const weights: number[] = []
			treatmentStartDates.forEach((treatmentDate: number) => {
				const diff = treatmentEndDate - treatmentDate
				treatmentDateOffsets.push(diff)
			})
			const totalTreatmentDatesForAllUnits = treatmentDateOffsets.reduce(
				(a, b) => a + b,
				0,
			)
			treatmentDateOffsets.forEach(treatmentDateOffset => {
				weights.push(treatmentDateOffset / totalTreatmentDatesForAllUnits)
			})
			return weightedMean(
				outputDataNonPlacebo.map((output: OutputData) => output.sdid_estimate),
				weights,
			).toFixed(2)
		}
	}, [
		inputData.endDate,
		timeAlignment,
		treatmentStartDates,
		outputDataNonPlacebo,
	])
}
