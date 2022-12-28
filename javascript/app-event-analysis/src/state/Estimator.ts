/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { Estimators } from '../types.js'

export const EstimatorState = atom<string>({
	key: 'EstimatorState',
	default:
		Object.keys(Estimators)[Object.values(Estimators).indexOf(Estimators.SDID)],
})

export function useEstimatorValueState(): string {
	return useRecoilValue(EstimatorState)
}

export function useSetEstimatorState(): SetterOrUpdater<string> {
	return useSetRecoilState(EstimatorState)
}

export function useEstimatorState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(EstimatorState)
}
