/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphEdge } from './GraphEdge'
import { GraphNode } from './GraphNode'

export interface Graph {
	elements: {
		nodes: GraphNode[]
		edges: GraphEdge[]
	}
}
