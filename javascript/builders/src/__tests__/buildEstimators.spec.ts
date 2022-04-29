/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { buildEstimators } from '../buildEstimators.js'
import { estimator } from './mocks.js'

describe('buildEstimators', () => {
	it('return a built the estimator', () => {
		const expected = {
			type: 'Treatment Assignment Model',
			label: 'Inverse Propensity Weighting',
			require_propensity_score: true,
			method_name: `backdoor.propensity_score_weighting`,
		}
		const [response] = buildEstimators([estimator])
		expect(response).toEqual(expected)
	})
})
