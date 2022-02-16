/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { pluralize } from '../lang'

describe('Lang Util Functions', () => {
	it('addS', () => {
		const elements = [1, 2]
		const result = pluralize(elements.length)
		expect(result).toBe('s')
	})
})
