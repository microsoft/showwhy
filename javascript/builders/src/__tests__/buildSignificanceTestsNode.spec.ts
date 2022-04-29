/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { GraphNodeType } from '@showwhy/types'

import { buildSignificanceTestsNode } from '../buildSignificanceTestsNode.js'
import { NodeIds } from '../types.js'
import { spec_ids } from './mocks.js'

describe('buildSignificanceTestsNode', () => {
	it('should build the significance tests node', () => {
		const expected = {
			nodes: [
				{
					type: GraphNodeType.SignificanceTest,
					result: 'significance_test',
					id: NodeIds.SignificanceTest,
					value: NodeIds.SignificanceTest,
					name: NodeIds.SignificanceTest,
					spec_ids,
				},
			],
		}
		const response = buildSignificanceTestsNode(spec_ids)
		expect(response).toEqual(expected)
	})
})
