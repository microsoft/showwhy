/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { addS, sortGroupByKey } from '../functions'

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
})
