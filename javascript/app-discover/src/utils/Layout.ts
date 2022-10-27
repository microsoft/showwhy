/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ElkNode } from 'elkjs'
import ELK from 'elkjs'

import type { CausalGraph } from '../domain/Graph.js'
import { relationshipsAboveThresholds } from '../domain/Graph.js'
;(window as any).g = null // Workaround for https://github.com/kieler/elkjs/issues/127

const elk = new ELK()

/**
 * Outputs an elkt string usable in https://rtsys.informatik.uni-kiel.de/elklive/elkgraph.html
 * @param graph Input graph
 * @param threshold Threshold to apply
 * @returns Elkt string
 */
export function toElkt(
	graph: CausalGraph,
	weightThreshold: number,
	confidenceThreshold: number,
): string {
	let elkData = '\n'
	graph.variables.forEach(v => {
		elkData += `node ${v.columnName} {label "${v.name}"}\n`
	})
	relationshipsAboveThresholds(
		graph,
		weightThreshold,
		confidenceThreshold,
	).forEach(e => {
		const keyA = e.source.columnName
		const keyB = e.target.columnName
		elkData += `edge ${keyA} -> ${keyB}\n`
	})
	return elkData
}

/**
 * Outputs an ElkNode object that can be used as an input to the ELK layout library.
 * @param graph 	Input graph
 * @param threshold	Threshold to apply
 * @returns ElkNode version of the graph
 */
export function toElkNode(
	graph: CausalGraph,
	weightThreshold: number,
	confidenceThreshold: number,
): ElkNode {
	return {
		id: 'root',
		children: graph.variables.map(variable => ({
			id: variable.columnName,
			width: 200,
			height: 100,
		})),
		edges: relationshipsAboveThresholds(
			graph,
			weightThreshold,
			confidenceThreshold,
		).map((relationship, i) => ({
			id: `e-${i}`,
			sources: [relationship.source.columnName],
			targets: [relationship.target.columnName],
		})),
	}
}

export async function layoutGraph(
	graph: CausalGraph,
	weightThreshold: number,
	confidenceThreshold: number,
): Promise<ElkNode> {
	const elkLayout = await elk.layout(
		toElkNode(graph, weightThreshold, confidenceThreshold),
		{
			layoutOptions: {
				'elk.algorithm': 'layered',
				'elk.direction': 'RIGHT',
			},
		},
	)
	return elkLayout
}
