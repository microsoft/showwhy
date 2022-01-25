/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~types'

export interface StatusResponse {
	runtimeStatus: NodeResponseStatus
	instanceId: string
}
