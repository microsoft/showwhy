/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { buildNodes } from './builders'
import { NodeTypes } from '~enums'
import { GraphNode, GraphEdge, NodeRequest, NodeResponse } from '~interfaces'
import { executeNode } from '~resources'

function dataObject(value: string): GraphNode {
	return {
		data: {
			id: value,
			value: value,
			name: value,
		},
	}
}
function edgeObject(value: string, generalExposure: string): GraphEdge {
	return {
		data: {
			source: value,
			target: generalExposure,
		},
	}
}

export function prepareData(
	confounders: string[] | null,
	outcomeDeterminants: string[] | null,
	generalExposure: string,
	generalOutcome: string,
): Promise<NodeResponse> {
	const edges: GraphEdge[] = []
	let nodes: GraphNode[] = []
	let variablesNames: string[] = []

	if (confounders) {
		variablesNames = variablesNames.concat(confounders?.map(x => x))
		const confoundersData: GraphNode[] = confounders.map((x: string) =>
			dataObject(x),
		)
		confoundersData.forEach(a => {
			edges.push(edgeObject(a.data.id, generalExposure))
			edges.push(edgeObject(a.data.id, generalOutcome))
		})
		nodes = nodes.concat(confoundersData)
	}
	if (outcomeDeterminants) {
		variablesNames = variablesNames.concat(outcomeDeterminants?.map(x => x))
		const outcomeData: GraphNode[] = outcomeDeterminants.map((x: string) =>
			dataObject(x),
		)
		outcomeData.forEach(a => {
			edges.push(edgeObject(a.data.id, generalOutcome))
		})
		nodes = nodes.concat(outcomeData)
	}

	edges.push(edgeObject(generalExposure, generalOutcome))

	nodes = nodes.concat(dataObject(generalOutcome))
	nodes = nodes.concat(dataObject(generalExposure))

	const obj = {
		causalGraph: {
			elements: {
				nodes: nodes,
				edges: edges,
			},
		},
	}

	const nodeReq = buildNodes([
		{
			type: NodeTypes.CreateCausalGraph,
			treatment: `${generalExposure}`,
			outcome: `${generalOutcome}`,
			dataframe: 'None',
			controls: variablesNames,
			causal_graph: obj.causalGraph,
		},
		{
			type: NodeTypes.IdentifyEstimand,
			causal_model: 'primary_maximum_model',
		},
	])

	return executeNode(nodeReq)
}

export const buildSignificanceTestsNode = (taskIds: string[]): NodeRequest => {
	const nodeReq = buildNodes([
		{
			type: NodeTypes.SignificanceTest,
			spec_ids: taskIds,
		},
	])
	return nodeReq
}

export const buildLoadNode = (url: string, fileName: string): NodeRequest => {
	const [dataframeName] = fileName.split('.')
	const nodeReq = buildNodes([
		{
			type: NodeTypes.LoadDataset,
			result: dataframeName,
			url,
		},
	])
	return nodeReq
}
