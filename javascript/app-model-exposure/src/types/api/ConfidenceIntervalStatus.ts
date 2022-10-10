/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StatusResponse } from './StatusResponse.js'

export interface ConfidenceIntervalStatus extends StatusResponse {
	results?: ConfidenceInterval[]
}

export interface ConfidenceInterval {
	estimate_id: string
	lower_bound: number
	upper_bound: number
}
