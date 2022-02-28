/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { NodeResponseStatus } from './NodeResponseStatus'
import type { TestResults } from './TestResults'

export interface SignificanceTestResponse {
	runtimeStatus: NodeResponseStatus
	total_simulations: number
	simulation_completed: number
	test_results?: TestResults
}
