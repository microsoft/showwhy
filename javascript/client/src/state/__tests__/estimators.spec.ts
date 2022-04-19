/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EstimatorGroup, EstimatorType } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'

import { useSetEstimators } from '~state'

import { estimatorState, useEstimators } from '../estimators'
const estimator = [
	{
		group: EstimatorGroup.Exposure,
		type: EstimatorType.PropensityScoreStratification,
	},
]

describe('estimatorState', () => {
	describe('useEstimators', () => {
		it('should return the default value', () => {
			const { result } = renderHook(() => useEstimators(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual([])
		})
	})

	describe('useSetEstimators', () => {
		it('should change the estimators state', () => {
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(estimatorState, estimator),
			)
				.getLoadable(estimatorState)
				.valueOrThrow()
			expect(snapshot).toBe(estimator)
		})
	})

	describe('useSetOrUpdateEstimator', () => {
		it('should change the estimators state', () => {
			const { result } = renderHook(
				() => {
					const setEstimator = useSetEstimators()
					const estimators = useEstimators()
					useEffect(() => {
						setEstimator(estimator!)
					}, [setEstimator])

					return estimators
				},
				{
					wrapper: RecoilRoot,
				},
			)
			expect(result.current).toEqual(estimator)
		})
	})
})
