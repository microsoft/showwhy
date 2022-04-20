/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'
import { table } from 'arquero'

import { useIsMicrodata } from '../useIsMicrodata'

describe('useIsMicrodata', () => {
	it('microdata returns true', () => {
		const _table = table({ colA: ['a', 'b', 'c'] })
		const identifier = 'colA'
		const { result } = renderHook(() => useIsMicrodata(_table, identifier))
		expect(result.current).toBe(true)
	})

	it('microdata returns false', () => {
		const _table = table({ colA: ['a', 'b', 'b'] })
		const identifier = 'colA'
		const { result } = renderHook(() => useIsMicrodata(_table, identifier))
		expect(result.current).toBe(false)
	})

	it('microdata returns true without a table', () => {
		const identifier = 'colA'
		const { result } = renderHook(() => useIsMicrodata(undefined, identifier))
		expect(result.current).toBe(true)
	})

	it('microdata returns true without a identifier', () => {
		const _table = table({ colA: ['a', 'b', 'c'] })
		const { result } = renderHook(() => useIsMicrodata(_table, undefined))
		expect(result.current).toBe(true)
	})
})
