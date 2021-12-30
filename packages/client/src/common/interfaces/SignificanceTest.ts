/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus, Significance } from '~enums'
import { NodeResponse } from '~interfaces'

interface TestResults {
	p_value: string
	significance: Significance
}

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
export interface SignificanceTestResponse {
	runtimeStatus: NodeResponseStatus
	total_simulations: number
	simulation_completed: number
	test_results?: TestResults
}
