/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { GraphNodeData } from '../graphs/index.js'

export interface NodeRequest {
	session_id?: string
	nodes: GraphNodeData[]
}
