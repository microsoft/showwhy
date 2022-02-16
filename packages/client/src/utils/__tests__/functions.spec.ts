/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { sortGroupByKey } from '../functions'

describe('Utils Functions', () => {
	it('sortGroupByKey', () => {
		const elements = [{ name: 'Bob' }, { name: 'Anne' }, { name: 'Carol' }]
		const expected = [{ name: 'Anne' }, { name: 'Bob' }, { name: 'Carol' }]
		const sort = sortGroupByKey('name')
		const result = [...elements].sort(sort)
		expect(result).toEqual(expected)
	})
})
