/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'

import type { Step } from '~types'

import { useMarkdown } from '../useMarkdown'

describe('useMarkdown hook', () => {
	it('should return empty string for step without getMarkdown', () => {
		const step = {} as Step
		const { result } = renderHook(() => useMarkdown(step))
		expect(result.current).toBe('')
	})

	it('should return markdown value for step with getMarkdown', async () => {
		const step = {
			getMarkdown: () => {
				return new Promise(function (resolve) {
					resolve({ default: 'markdown1' })
				})
			},
		} as Step
		const { result, waitForNextUpdate } = renderHook(() => useMarkdown(step))
		await waitForNextUpdate()
		expect(result.current).toBe('markdown1')
	})
})
