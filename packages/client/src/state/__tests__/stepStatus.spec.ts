/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import { stepStatusState, useStepStatus } from '../stepStatus'
import { StepStatus } from '../../common/enums'

describe('stepStatusState', () => {
	describe('useStepStatus', () => {
		it('should return the default value', () => {
			const { result } = renderHook(() => useStepStatus('a'), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toBeUndefined()
		})
	})

	describe('useSetStepStatus', () => {
		it('should change the step state', () => {
			const expected = StepStatus.Done
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(stepStatusState('a'), expected),
			)
				.getLoadable(stepStatusState('a'))
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})
})
