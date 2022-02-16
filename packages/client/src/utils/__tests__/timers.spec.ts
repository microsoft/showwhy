/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { returnElapsedTime } from '../timers'

describe('Utils Functions', () => {
	it('returnElapsedTime', () => {
		const initialTime = new Date('2021-12-12 5:50:00')
		const finalTime = new Date('2021-12-12 5:55:05')
		const expected = '5min 05s'

		const result = returnElapsedTime(initialTime, finalTime)
		expect(result).toEqual(expected)
	})
})
