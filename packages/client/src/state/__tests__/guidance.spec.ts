/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { useGuidance } from '../guidance'

describe('guidanceState', () => {
	describe('useGuidance', () => {
		it('should return true as default value', () => {
			const expected = true
			const { result } = renderHook(() => useGuidance(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual(expected)
		})
	})
})
