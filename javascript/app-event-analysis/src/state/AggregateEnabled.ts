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

import type { Treatment } from '../types.js'

export const AggTreatmentState = atom<Treatment | null>({
	key: 'aggTreatmentState',
	default: null,
})

export function useAggTreatmentValueState(): Treatment | null {
	return useRecoilValue(AggTreatmentState)
}

export function useSetAggTreatmentState(): SetterOrUpdater<Treatment | null> {
	return useSetRecoilState(AggTreatmentState)
}

export function useAggTreatmentState(): [
	Treatment | null,
	SetterOrUpdater<Treatment | null>,
] {
	return useRecoilState(AggTreatmentState)
}

export function useAggTreatmentResetState(): Resetter {
	return useResetRecoilState(AggTreatmentState)
}
