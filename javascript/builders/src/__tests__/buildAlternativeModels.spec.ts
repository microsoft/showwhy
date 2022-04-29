/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildAlternativeModels } from '../buildAlternativeModels.js'
import { getExpectedModel, model, model2 } from './mocks.js'

describe('buildAlternativeModels', () => {
	it('returns an AlternativeModelSpec array', () => {
		const expected = [
			getExpectedModel('Maximum', model),
			getExpectedModel('Minimum', model),
			getExpectedModel('Unadjusted', model2),
		]
		const result = buildAlternativeModels(model, model, model, model2)
		expect(result).toEqual(expected)
	})
})
