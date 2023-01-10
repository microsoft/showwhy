/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

interface TreatmentStartDates {
	tStartDates: number[]
}

export const TreatmentStartDatesAfterEstimateState =
	atom<TreatmentStartDates | null>({
		key: 'treatmentStartDatesAfterEstimateState',
		default: null,
	})

export function useTreatmentStartDatesAfterEstimateValueState(): TreatmentStartDates | null {
	return useRecoilValue(TreatmentStartDatesAfterEstimateState)
}

export function useSetTreatmentStartDatesAfterEstimateState(): SetterOrUpdater<TreatmentStartDates | null> {
	return useSetRecoilState(TreatmentStartDatesAfterEstimateState)
}

export function useTreatmentStartDatesAfterEstimateState(): [
	TreatmentStartDates | null,
	SetterOrUpdater<TreatmentStartDates | null>,
] {
	return useRecoilState(TreatmentStartDatesAfterEstimateState)
}

export function useTreatmentStartDatesAfterEstimateResetState(): Resetter {
	return useResetRecoilState(TreatmentStartDatesAfterEstimateState)
}
