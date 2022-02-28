/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import type { Estimator } from '@showwhy/types'

export const estimatorState = atom<Estimator[]>({
	key: 'estimators',
	default: [],
})

export function useEstimators(): Estimator[] {
	return useRecoilValue(estimatorState)
}

export function useAddEstimator(): (file: Estimator) => void {
	const setEstimators = useSetRecoilState(estimatorState)
	return useCallback(
		(file: Estimator) => {
			setEstimators(prev => [...prev, file])
		},
		[setEstimators],
	)
}

export function useSetEstimators(): SetterOrUpdater<Estimator[]> {
	return useSetRecoilState(estimatorState)
}

export function useSetOrUpdateEstimator(): (estimator: Estimator) => void {
	const setEstimators = useSetRecoilState(estimatorState)
	return useCallback(
		(estimator: Estimator) => {
			setEstimators(prev => {
				const exists = prev.find(i => i.type === estimator.type)
				return !exists
					? [...prev, estimator]
					: [...prev.filter(i => i.type !== estimator.type), estimator]
			})
		},
		[setEstimators],
	)
}

export function useResetEstimators(): Resetter {
	return useResetRecoilState(estimatorState)
}
