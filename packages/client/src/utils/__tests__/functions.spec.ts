/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { addS, returnElapsedTime, sortGroupByKey } from '../functions'

describe('Utils Functions', () => {
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

	it('returnElapsedTime', () => {
		const initialTime = new Date('2021-12-12 5:50:00')
		const finalTime = new Date('2021-12-12 5:55:05')
		const expected = '5min 05s'

		const result = returnElapsedTime(initialTime, finalTime)
		expect(result).toEqual(expected)
	})
})
