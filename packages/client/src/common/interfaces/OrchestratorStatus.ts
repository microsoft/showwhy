/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { StatusResponse } from './StatusResponse'

export interface OrchestratorStatus extends StatusResponse {
	name: string
	instanceId: string
	input: string
	customStatus: string
	output?: string
	createdTime: string
	lastUpdatedTime: string
}
