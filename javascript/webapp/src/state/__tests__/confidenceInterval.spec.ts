/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'

import {
	confidenceIntervalState,
	useConfidenceInterval,
	useResetConfidenceInterval,
	useSetConfidenceInterval,
} from '~state/confidenceInterval'

describe('confidenceIntervalState', () => {
	describe('useConfidenceInterval', () => {
		it('should return the default value (false)', () => {
			const expected = false
			const { result } = renderHook(() => useConfidenceInterval(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual(expected)
		})
	})

	describe('useSetConfidenceInterval', () => {
		it('should change confidence interval to true', () => {
			const expected = true
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(confidenceIntervalState, true),
			)
				.getLoadable(confidenceIntervalState)
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})

	describe('resetConfidenceInterval', () => {
		it('after reset should return default value (false)', () => {
			const expected = false
			const { result } = renderHook(
				() => {
					const setConfidenceInterval = useSetConfidenceInterval()
					const confidenceInterval = useConfidenceInterval()
					const reset = useResetConfidenceInterval()
					useEffect(() => {
						setConfidenceInterval(true)
						reset()
					}, [setConfidenceInterval, reset])
					return confidenceInterval
				},
				{
					wrapper: RecoilRoot,
				},
			)
			expect(result.current).toEqual(expected)
		})
	})
})
