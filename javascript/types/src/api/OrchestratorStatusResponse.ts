/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StatusResponse } from './StatusResponse.js'

export interface OrchestratorStatusResponse extends StatusResponse {
	name: string
	instanceId: string
	input: string
	customStatus: string
	output?: string
	createdTime: string
	lastUpdatedTime: string
}
