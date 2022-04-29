/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildModelLevel } from '../buildModelLevel.js'
import { getExpectedModel, model, model2 } from './mocks.js'

describe('buildModelLevel', () => {
	it('should return a Maximum AlternativeModelSpec', () => {
		const expected = getExpectedModel('Maximum', model)
		const response = buildModelLevel('Maximum', model)
		expect(response).toEqual(expected)
	})
	it('should return an Unadjusted AlternativeModelSpec', () => {
		const expected = getExpectedModel('Unadjusted', model2)
		const response = buildModelLevel('Unadjusted', model2)
		expect(response).toEqual(expected)
	})
	it('should return undefined', () => {
		const response = buildModelLevel('Maximum', model2)
		expect(response).toBeUndefined()
	})
})
