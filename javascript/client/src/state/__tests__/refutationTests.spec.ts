/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RefutationType } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import { RefutationTypeState, useRefutationType } from '../refutationTests'

describe('refutationTypeState', () => {
	describe('useRefutationType', () => {
		it('should return the default value', () => {
			const expected = RefutationType.QuickRefutation
			const { result } = renderHook(() => useRefutationType(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual(expected)
		})
	})

	describe('useSetRefutationTests', () => {
		it('should change the refutationType state', () => {
			const expected = RefutationType.FullRefutation
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(RefutationTypeState, expected),
			)
				.getLoadable(RefutationTypeState)
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})
})
