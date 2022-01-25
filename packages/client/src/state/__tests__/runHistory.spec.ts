/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import { runHistoryState, useRunHistory } from '../runHistory'
import { RunHistory } from '~types'

describe('runHistoryState', () => {
	describe('useRunHistory', () => {
		it('should return the default value', () => {
			const { result } = renderHook(() => useRunHistory(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual([])
		})
	})

	describe('useSetRunHistory', () => {
		it('should change the run history state', () => {
			const expected = [
				{ runNumber: 10, id: '123', isActive: true },
			] as RunHistory[]
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(runHistoryState, expected),
			)
				.getLoadable(runHistoryState)
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})
})
