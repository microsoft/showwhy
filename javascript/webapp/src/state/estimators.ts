/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Estimator } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const estimatorState = atom<Estimator[]>({
	key: 'estimators',
	default: [],
})

export function useEstimators(): Estimator[] {
	return useRecoilValue(estimatorState)
}

export function useSetEstimators(): SetterOrUpdater<Estimator[]> {
	return useSetRecoilState(estimatorState)
}

export function useResetEstimators(): Resetter {
	return useResetRecoilState(estimatorState)
}
