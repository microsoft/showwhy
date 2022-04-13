/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowStep } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { useMarkdown } from '../useMarkdown'

describe('useMarkdown hook', () => {
	it('should return empty string for step without getMarkdown', () => {
		const step = {} as WorkflowStep
		const { result } = renderHook(() => useMarkdown(step.getMarkdown))
		expect(result.current).toBe('')
	})

	it('should return markdown value for step with getMarkdown', async () => {
		const step = {
			getMarkdown: () => {
				return new Promise(function (resolve) {
					resolve({ default: 'markdown1' })
				})
			},
		} as WorkflowStep
		const { result, waitForNextUpdate } = renderHook(() =>
			useMarkdown(step.getMarkdown),
		)
		await waitForNextUpdate()
		expect(result.current).toBe('markdown1')
	})
})
