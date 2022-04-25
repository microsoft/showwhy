/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'

import { refutationCountState, useRefutationCount } from '../refutationCount'

describe('refutationTypeState', () => {
	describe('useRefutationCount', () => {
		it('should return the default value', () => {
			const expected = 5
			const { result } = renderHook(() => useRefutationCount(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual(expected)
		})
	})

	describe('useSetRefutationCount', () => {
		it('should change the refutationCount state', () => {
			const expected = 10
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(refutationCountState, expected),
			)
				.getLoadable(refutationCountState)
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})
})
