/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { elapsedTime } from '../ProgressBar.utils'

describe('Utils Functions', () => {
	it('elapsedTime', () => {
		const initialTime = new Date('2021-12-12 5:50:00')
		const finalTime = new Date('2021-12-12 5:55:05')
		const expected = '5min 05s'

		const result = elapsedTime(initialTime, finalTime)
		expect(result).toEqual(expected)
	})
})
