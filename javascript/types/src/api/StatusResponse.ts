/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { NodeResponseStatus } from './NodeResponseStatus'

export interface StatusResponse {
	runtimeStatus: NodeResponseStatus
	instanceId: string
}
