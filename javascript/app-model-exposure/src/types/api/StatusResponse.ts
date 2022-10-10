/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { NodeResponseStatus } from './NodeResponseStatus.js'

export interface StatusResponse {
	taskId?: string
	status: NodeResponseStatus
	completed: number
	pending: number
	failed: number
	error?: string
}
