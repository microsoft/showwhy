/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphNodeType, GraphNodeData, NodeRequest } from '@showwhy/types'

interface Node {
	type: GraphNodeType
	[key: string]: any
}

enum NodeIds {
	IdentifyEstimand = 'Identify Estimand',
	CreateCausalGraph = 'Create Causal Graph',
	LoadDataset = 'Load Dataset',
	EstimateEffects = 'Estimate Effects',
	SignificanceTest = 'Significance Test',
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
		case GraphNodeType.IdentifyEstimand:
			return {
				type: GraphNodeType.IdentifyEstimand,
				result: 'primary_estimand',
				id: NodeIds.IdentifyEstimand,
				value: NodeIds.IdentifyEstimand,
				name: NodeIds.IdentifyEstimand,
			}
		case GraphNodeType.CreateCausalGraph:
			return {
				type: GraphNodeType.CreateCausalGraph,
				result: 'primary_maximum_model',
				id: NodeIds.CreateCausalGraph,
				value: NodeIds.CreateCausalGraph,
				name: NodeIds.CreateCausalGraph,
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
