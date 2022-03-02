/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { GraphNodeData } from '../graphs'

export interface NodeRequest {
	session_id?: string
	nodes: GraphNodeData[]
}
