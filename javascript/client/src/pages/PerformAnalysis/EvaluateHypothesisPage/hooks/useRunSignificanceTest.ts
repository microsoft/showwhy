/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getConfidenceOrchestrator, isStatus } from '@showwhy/api-client'
import type {
	Maybe,
	NodeResponse,
	SignificanceTest,
	SignificanceTestResponse,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback } from 'react'

import { api } from '~resources'
import { useSetSignificanceTest } from '~state'
import { percentage, updateSignificanceTests } from '~utils'

export function useRunSignificanceTest(runId: Maybe<string>): () => any {
	const setSignificanceTest = useSetSignificanceTest()

	const onUpdate = useCallback(
		(status: SignificanceTestResponse) => {
			if (isStatus(status.runtimeStatus, NodeResponseStatus.Terminated)) {
				return updateSignificanceTests(setSignificanceTest, runId)
			}

			if (!runId) return null
			const result = {
				runId,
				simulation_completed: status.simulation_completed || 0,
				test_results: status.test_results,
				total_simulations: status.total_simulations || 0,
				status: status.runtimeStatus,
				percentage: percentage(
					status?.simulation_completed || 0,
					status.total_simulations || 1,
				),
			}
			updateSignificanceTests(setSignificanceTest, runId, result)
		},
		[runId, setSignificanceTest],
	)

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = getConfidenceInterval(runId as string, nodeResponse)
			updateSignificanceTests(setSignificanceTest, runId, initialRun)
		},
		[runId, setSignificanceTest],
	)

	const run = useCallback((): any => {
		return getConfidenceOrchestrator(
			api,
			onStart,
			onUpdate,
			undefined,
			undefined,
			true,
		)
	}, [onStart, onUpdate])

	return run
}

function getConfidenceInterval(
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
