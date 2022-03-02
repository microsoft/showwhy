/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { percentage } from '../stats'

describe('Stats Functions', () => {
	it('returnPercentage', () => {
		const completed = 10
		const total = 100
		const expected = 10
		const result = percentage(completed, total)
		expect(result).toEqual(expected)
	})
})
