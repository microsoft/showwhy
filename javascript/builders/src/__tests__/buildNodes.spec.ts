/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { GraphNodeType } from '@showwhy/types'

import { buildNodes } from '../buildNodes.js'
import { NodeIds } from '../types.js'
import { fileName, props, spec_ids, url } from './mocks.js'

describe('buildNodes', () => {
	it('should a build EstimateEffects node', () => {
		const expected = {
			nodes: [
				{
					type: GraphNodeType.EstimateEffects,
					result: 'estimate_results',
					id: NodeIds.EstimateEffects,
					value: NodeIds.EstimateEffects,
					name: NodeIds.EstimateEffects,
					...props,
				},
			],
		}

		const response = buildNodes([
			{ type: GraphNodeType.EstimateEffects, ...props },
		])
		expect(response).toEqual(expected)
	})

	it('should a build LoadDataset node', () => {
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
		const [result] = fileName.split('.')
		const response = buildNodes([
			{ type: GraphNodeType.LoadDataset, url, result },
		])
		expect(response).toEqual(expected)
	})

	it('should a build SignificanceTest node', () => {
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
		const response = buildNodes([
			{ type: GraphNodeType.SignificanceTest, spec_ids },
		])
		expect(response).toEqual(expected)
	})
})
