/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isStatusProcessing } from '../estimate'
import { NodeResponseStatus } from '~types'

describe('estimate utils functions', () => {
	it('isStatusProcessing => Running', () => {
		const status = NodeResponseStatus.Running
		const result = isStatusProcessing(status)
		expect(result).toBe(true)
	})

	it('isStatusProcessing => Processing', () => {
		const status = NodeResponseStatus.Processing
		const result = isStatusProcessing(status)
		expect(result).toBe(true)
	})

	it('isStatusProcessing => InProgress', () => {
		const status = NodeResponseStatus.InProgress
		const result = isStatusProcessing(status)
		expect(result).toBe(true)
	})

	it('isStatusProcessing => Pending', () => {
		const status = NodeResponseStatus.Pending
		const result = isStatusProcessing(status)
		expect(result).toBe(true)
	})

	it('isStatusProcessing => Terminated', () => {
		const status = NodeResponseStatus.Terminated
		const result = isStatusProcessing(status)
		expect(result).toBe(false)
	})

	it('isStatusProcessing => Completed', () => {
		const status = NodeResponseStatus.Completed
		const result = isStatusProcessing(status)
		expect(result).toBe(false)
	})
})
