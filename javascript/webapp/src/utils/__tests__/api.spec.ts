/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isProcessingStatus } from '@showwhy/api-client'
import { NodeResponseStatus } from '@showwhy/types'

describe('api utils functions', () => {
	it('isProcessingStatus => Running', () => {
		const status = NodeResponseStatus.Running
		const result = isProcessingStatus(status)
		expect(result).toBe(true)
	})

	it('isProcessingStatus => Processing', () => {
		const status = NodeResponseStatus.Processing
		const result = isProcessingStatus(status)
		expect(result).toBe(true)
	})

	it('isProcessingStatus => InProgress', () => {
		const status = NodeResponseStatus.InProgress
		const result = isProcessingStatus(status)
		expect(result).toBe(true)
	})

	it('isProcessingStatus => Pending', () => {
		const status = NodeResponseStatus.Pending
		const result = isProcessingStatus(status)
		expect(result).toBe(true)
	})

	it('isProcessingStatus => Terminated', () => {
		const status = NodeResponseStatus.Terminated
		const result = isProcessingStatus(status)
		expect(result).toBe(false)
	})

	it('isProcessingStatus => Completed', () => {
		const status = NodeResponseStatus.Completed
		const result = isProcessingStatus(status)
		expect(result).toBe(false)
	})
})
