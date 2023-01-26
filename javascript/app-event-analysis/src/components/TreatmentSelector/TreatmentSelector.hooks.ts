/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { clone, cloneDeep } from 'lodash'
import { useCallback } from 'react'

import {
	useOutputResResetState,
	useOutputResState,
	usePlaceboOutputResResetState,
	useTreatedUnitsResetState,
	useTreatedUnitsState,
	useTreatedUnitsValueState,
	useTreatmentStartDatesResetState,
	useTreatmentStartDatesState,
} from '../../state/index.js'
import type { ProcessedInputData } from '../../types.js'

export function useHandleTreatedUnitChange() {
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	return useCallback(
		(oldTreatedUnit: string, newTreatedUnit: string) => {
			// if newly selected treated unit exist in the list of treated unit, then do not proceed
			// otherwise, update the list of treated unit with the new selection
			const oldTreatedUnitIndex = treatedUnits.findIndex(
				(unit) => unit === oldTreatedUnit,
			)
			const newTreatedUnitIndex = treatedUnits.findIndex(
				(unit) => unit === newTreatedUnit,
			)
			if (newTreatedUnitIndex < 0) {
				const updatedUnits = clone(treatedUnits)
				updatedUnits[oldTreatedUnitIndex] = newTreatedUnit
				setTreatedUnits(updatedUnits)
			}
		},
		[setTreatedUnits, treatedUnits],
	)
}

export function useHandleTreatmentDateChange() {
	const treatedUnits = useTreatedUnitsValueState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()

	return useCallback(
		(treatmentDate: number, treatedUnit: string) => {
			const treatedUnitIndex = treatedUnits.findIndex(
				(unit) => unit === treatedUnit,
			)
			const updatedPeriods = clone(treatmentStartDates)
			updatedPeriods[treatedUnitIndex] = treatmentDate
			setTreatmentStartDates(updatedPeriods)
		},
		[setTreatmentStartDates, treatedUnits, treatmentStartDates],
	)
}

export function useHandleRemoveTreatmentUnit() {
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()
	const [outputRes, setOutputRes] = useOutputResState()
	const resetPlaceboOutputRes = usePlaceboOutputResResetState()

	return useCallback(
		(treatedUnit: string) => {
			const treatedUnitIndex = treatedUnits.findIndex(
				(unit) => unit === treatedUnit,
			)
			const updatedUnits = treatedUnits.filter((unit) => unit !== treatedUnit)
			const updatedPeriods = clone(treatmentStartDates)
			updatedPeriods.splice(treatedUnitIndex, 1) // remove at index
			setTreatedUnits(updatedUnits)
			setTreatmentStartDates(updatedPeriods)

			if (updatedUnits.length === 0) {
				// clear output data
				setOutputRes(null)
				resetPlaceboOutputRes()
			} else {
				// a treated unit may have been removed
				// ensure that any cached output for such removed unit is also filtered out
				if (outputRes != null) {
					const updatedOutputRes = cloneDeep(outputRes)
					setOutputRes({
						...updatedOutputRes,
						outputs: updatedOutputRes.outputs.filter((output) =>
							treatedUnits.includes(output.unit),
						),
					})
				}
			}
		},
		[
			treatedUnits,
			treatmentStartDates,
			outputRes,
			setOutputRes,
			resetPlaceboOutputRes,
			setTreatedUnits,
			setTreatmentStartDates,
		],
	)
}

export function useAddNewTreatedUnit(data: ProcessedInputData) {
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()
	return useCallback(() => {
		if (data.uniqueUnits.length) {
			let updatedUnits: string[] = []
			let updatedPeriods: number[] = []
			if (treatedUnits.length) {
				// pick next untreated unit
				const controlUnits = data.uniqueUnits.filter((unit) =>
					treatedUnits.every((tUnit) => unit !== tUnit),
				)
				updatedUnits = [...treatedUnits, controlUnits[0]]
				updatedPeriods = [...treatmentStartDates, treatmentStartDates[0]]
			} else {
				updatedUnits = [data.uniqueUnits[0]]
				updatedPeriods = [data.startDate]
			}
			setTreatedUnits(updatedUnits)
			setTreatmentStartDates(updatedPeriods)
		}
	}, [
		data,
		treatedUnits,
		treatmentStartDates,
		setTreatedUnits,
		setTreatmentStartDates,
	])
}

export function useClearAllTreatedUnits() {
	const resetOutputRes = useOutputResResetState()
	const resetTreatedUnits = useTreatedUnitsResetState()
	const resetPlaceboOutputRes = usePlaceboOutputResResetState()
	const resetTreatmentStartDates = useTreatmentStartDatesResetState()
	return useCallback(() => {
		resetOutputRes()
		resetTreatedUnits()
		resetPlaceboOutputRes()
		resetTreatmentStartDates()
	}, [
		resetOutputRes,
		resetTreatedUnits,
		resetPlaceboOutputRes,
		resetTreatmentStartDates,
	])
}
