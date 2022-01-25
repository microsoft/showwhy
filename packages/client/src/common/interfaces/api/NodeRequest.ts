/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Node } from '../Node'

export interface NodeRequest {
	session_id?: string
	nodes: Node[]
}
