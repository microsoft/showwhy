/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	addOrRemoveArrayElement,
	addS,
	replaceItemAtIndex,
	returnElapsedTime,
	returnPercentage,
	sortGroupByKey,
} from '../functions'

describe('Utils Functions', () => {
	it('replaceItemAtIndex', () => {
		const elements = [1, 2, 4, 5, 6]
		const expected = [1, 2, 3, 5, 6]
		const result = replaceItemAtIndex(elements, 2, 3)
		expect(result).toEqual(expected)
	})

	it('sortGroupByKey', () => {
		const elements = [{ name: 'Bob' }, { name: 'Anne' }, { name: 'Carol' }]
		const expected = [{ name: 'Anne' }, { name: 'Bob' }, { name: 'Carol' }]
		const sort = sortGroupByKey('name')
		const result = [...elements].sort(sort)
		expect(result).toEqual(expected)
	})

	it('addS', () => {
		const elements = [1, 2]
		const result = addS(elements.length)
		expect(result).toBe('s')
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

	it('returnElapsedTime', () => {
		const initialTime = new Date('2021-12-12 5:50:00')
		const finalTime = new Date('2021-12-12 5:55:05')
		const expected = '5min 05s'

		const result = returnElapsedTime(initialTime, finalTime)
		expect(result).toEqual(expected)
	})

	it('returnPercentage', () => {
		const completed = 10
		const total = 100
		const expected = 10
		const result = returnPercentage(completed, total)
		expect(result).toEqual(expected)
	})
})
