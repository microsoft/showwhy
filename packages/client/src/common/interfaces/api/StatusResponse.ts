/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~interfaces'

export interface StatusResponse {
	runtimeStatus: NodeResponseStatus
	instanceId: string
}
