/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getSignificanceOrchestrator, isStatus } from '@showwhy/api-client'
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

export function useRunSignificanceTest(
	runId: Maybe<string>,
	outcome: string,
	taskIds: string[],
): () => any {
	const setSignificanceTest = useSetSignificanceTest()

	const onUpdate = useCallback(
		(status: SignificanceTestResponse) => {
			if (isStatus(status.runtimeStatus, NodeResponseStatus.Terminated)) {
				return updateSignificanceTests(setSignificanceTest, runId, outcome)
			}

			if (!runId) return null
			const result = {
				runId,
				outcome,
				simulation_completed: status.simulation_completed || 0,
				test_results: status.test_results,
				total_simulations: status.total_simulations || 0,
				status: status.runtimeStatus,
				percentage: percentage(
					status?.simulation_completed || 0,
					status.total_simulations || 1,
				),
			}
			updateSignificanceTests(setSignificanceTest, runId, outcome, result)
		},
		[runId, setSignificanceTest, outcome],
	)

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = getSignificanceTest(
				runId as string,
				nodeResponse,
				outcome,
				taskIds,
			)
			updateSignificanceTests(setSignificanceTest, runId, outcome, initialRun)
		},
		[runId, setSignificanceTest, outcome, taskIds],
	)

	const run = useCallback((): any => {
		return getSignificanceOrchestrator(
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

function getSignificanceTest(
	runId: string,
	nodeResponse: NodeResponse,
	outcome: string,
	taskIds: string[],
): SignificanceTest {
	return {
		runId,
		outcome,
		percentage: 0,
		total_simulations: 100,
		simulation_completed: 0,
		status: NodeResponseStatus.Pending,
		startTime: new Date(),
		nodeResponse,
		taskIds,
	}
}
