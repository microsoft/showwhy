/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphNodeData, NodeRequest } from '@showwhy/types'
import { GraphNodeType } from '@showwhy/types'

import { NodeIds } from './types.js'

interface Node {
	type: GraphNodeType
	[key: string]: any
}

export function buildNodes(nodes: Node[]): NodeRequest {
	return {
		nodes: nodes.map(node => {
			const { type, ...properties } = node
			return {
				...getNodeProperties(type),
				...properties,
			}
		}),
	} as NodeRequest
}

function getNodeProperties(type: GraphNodeType): GraphNodeData {
	switch (type) {
		case GraphNodeType.EstimateEffects:
			return {
				type: GraphNodeType.EstimateEffects,
				result: 'estimate_results',
				id: NodeIds.EstimateEffects,
				value: NodeIds.EstimateEffects,
				name: NodeIds.EstimateEffects,
			}
		case GraphNodeType.LoadDataset:
			return {
				type: GraphNodeType.LoadDataset,
				id: NodeIds.LoadDataset,
				value: NodeIds.LoadDataset,
				name: NodeIds.LoadDataset,
			}
		case GraphNodeType.SignificanceTest:
			return {
				type: GraphNodeType.SignificanceTest,
				result: 'significance_test',
				id: NodeIds.SignificanceTest,
				value: NodeIds.SignificanceTest,
				name: NodeIds.SignificanceTest,
			}
	}
}
