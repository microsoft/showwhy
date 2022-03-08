/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphEdge } from './GraphEdge.js'
import type { GraphNode } from './GraphNode.js'

export interface Graph {
	elements: {
		nodes: GraphNode[]
		edges: GraphEdge[]
	}
}
