/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TestResults } from '../experiments'
import type { NodeResponseStatus } from '~types'

export interface SignificanceTestResponse {
	runtimeStatus: NodeResponseStatus
	total_simulations: number
	simulation_completed: number
	test_results?: TestResults
}
