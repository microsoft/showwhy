/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { GraphNodeType } from '@showwhy/types'

import { buildLoadNode } from '../buildLoadNode.js'
import { NodeIds } from '../types.js'
import { fileName, url } from './mocks.js'

describe('buildLoadNode', () => {
	it('should return a built LoadNode', () => {
		const expected = {
			nodes: [
				{
					type: GraphNodeType.LoadDataset,
					id: NodeIds.LoadDataset,
					value: NodeIds.LoadDataset,
					name: NodeIds.LoadDataset,
					result: 'data',
					url,
				},
			],
		}
		const response = buildLoadNode(url, fileName)
		expect(response).toEqual(expected)
	})
})
