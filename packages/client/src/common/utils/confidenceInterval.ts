/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeResponseStatus } from '~enums'
import { NodeResponse, SignificanceTest } from '~interfaces'

export function returnInitialConfidenceInterval(
	runId: string,
	nodeResponse: NodeResponse,
): SignificanceTest {
	return {
		runId,
		percentage: 0,
		total_simulations: 100,
		simulation_completed: 0,
		status: NodeResponseStatus.Pending,
		startTime: new Date(),
		nodeResponse,
	}
}
