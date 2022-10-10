/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StatusResponse } from './StatusResponse.js'

export interface SignificanceTestStatus extends StatusResponse {
	outcome?: string
	taskIds?: string[]
	startTime?: Date
	results?: SignificanceTestResult
}

interface SignificanceTestResult {
	p_value: string
	significance: boolean
}
