/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalityLevel } from '@showwhy/types'

import { buildSpecs } from '../buildSpecs.js'
import { exposure, outcome, population } from './mocks.js'

describe('buildSpecs', () => {
	const dataframe = 'df'

	it('should return a built spec', () => {
		const expected = {
			population_specs: [
				{
					type: CausalityLevel.Primary,
					label: 'pop',
					dataframe,
					population_id: 'pop_col',
				},
			],
			treatment_specs: [
				{
					type: CausalityLevel.Primary,
					label: 'exp',
					variable: 'exp_col',
				},
			],
			outcome_specs: [
				{
					type: CausalityLevel.Primary,
					label: 'out',
					variable: 'out_col',
				},
			],
		}

		const response = buildSpecs(dataframe, population, exposure, outcome)
		expect(response).toEqual(expected)
	})
})
