/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~enums'
import { NodeResponse } from '~interfaces'
import { TestResults } from './TestResults'

export interface SignificanceTest {
	runId: string
	status?: NodeResponseStatus
	total_simulations?: number
	simulation_completed?: number
	test_results?: TestResults
	startTime?: Date
	percentage?: number
	nodeResponse?: NodeResponse
}
