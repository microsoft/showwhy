/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { sortByField } from '../GenericTable.utils'

describe('Generic Table Utils', () => {
	it('sortByField', () => {
		const elements = [{ name: 'Bob' }, { name: 'Anne' }, { name: 'Carol' }]
		const expected = [{ name: 'Anne' }, { name: 'Bob' }, { name: 'Carol' }]
		const sort = sortByField('name')
		const result = [...elements].sort(sort)
		expect(result).toEqual(expected)
	})
})
