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

export const TreatmentStartDatesState = atom<number[]>({
	key: 'TreatmentStartDateState',
	default: [],
})

export function useTreatmentStartDatesValueState(): number[] {
	return useRecoilValue(TreatmentStartDatesState)
}

export function useSetTreatmentStartDatesState(): SetterOrUpdater<number[]> {
	return useSetRecoilState(TreatmentStartDatesState)
}

export function useTreatmentStartDatesState(): [
	number[],
	SetterOrUpdater<number[]>,
] {
	return useRecoilState(TreatmentStartDatesState)
}

export function useTreatmentStartDatesResetState(): Resetter {
	return useResetRecoilState(TreatmentStartDatesState)
}
