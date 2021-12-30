/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isStatusProcessing } from '../estimate'

describe('estimate utils functions', () => {
	it('isStatusProcessing => Running', () => {
		const status = 'Running'
		const expected = true
		const result = isStatusProcessing(status)
		expect(result).toEqual(expected)
	})

	it('isStatusProcessing => Processing', () => {
		const status = 'Processing'
		const expected = true
		const result = isStatusProcessing(status)
		expect(result).toEqual(expected)
	})

	it('isStatusProcessing => InProgress', () => {
		const status = 'In_progress'
		const expected = true
		const result = isStatusProcessing(status)
		expect(result).toEqual(expected)
	})

	it('isStatusProcessing => Pending', () => {
		const status = 'Pending'
		const expected = true
		const result = isStatusProcessing(status)
		expect(result).toEqual(expected)
	})

	it('isStatusProcessing => Terminated', () => {
		const status = 'Terminated'
		const expected = false
		const result = isStatusProcessing(status)
		expect(result).toEqual(expected)
	})

	it('isStatusProcessing => Completed', () => {
		const status = 'Completed'
		const expected = false
		const result = isStatusProcessing(status)
		expect(result).toEqual(expected)
	})
})
