/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildRefutationSpecs } from '../buildRefutationSpecs.js'

describe('buildRefutationSpecs', () => {
	const sim = 100
	it('should build the refutation specs', () => {
		const expected = { num_simulations: sim }
		const response = buildRefutationSpecs(sim)
		expect(response).toEqual(expected)
	})
})
