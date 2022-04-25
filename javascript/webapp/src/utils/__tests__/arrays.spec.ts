/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { addOrRemoveArrayElement, replaceItemAtIndex } from '../arrays'

describe('Utils Functions', () => {
	it('replaceItemAtIndex', () => {
		const elements = [1, 2, 4, 5, 6]
		const expected = [1, 2, 3, 5, 6]
		const result = replaceItemAtIndex(elements, 2, 3)
		expect(result).toEqual(expected)
	})

	it('addOrRemoveArrayElement -> REMOVE', () => {
		const elements = ['1', '2', '3', '4', '5', '6']
		const expected = ['1', '2', '3', '5', '6']
		const result = addOrRemoveArrayElement(elements, '4', false)
		expect(result).toEqual(expected)
	})

	it('addOrRemoveArrayElement -> ADD', () => {
		const elements = ['1', '2', '3', '4', '5', '6']
		const expected = ['1', '2', '3', '4', '5', '6', '7']
		const result = addOrRemoveArrayElement(elements, '7', true)
		expect(result).toEqual(expected)
	})
})
