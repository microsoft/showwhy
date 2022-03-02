/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphEdge } from './GraphEdge'
import type { GraphNode } from './GraphNode'

export interface Graph {
	elements: {
		nodes: GraphNode[]
		edges: GraphEdge[]
	}
}
