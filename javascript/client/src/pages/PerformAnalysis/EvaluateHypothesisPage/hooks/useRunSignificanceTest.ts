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
import { percentage } from '~utils'

export function useRunSignificanceTest(runId: Maybe<string>): () => any {
	const updateSignificanceTest = useUpdateSignificanceTests(runId)

	const onUpdate = useCallback(
		(status: SignificanceTestResponse) => {
			if (isStatus(status.runtimeStatus, NodeResponseStatus.Terminated)) {
				return updateSignificanceTest()
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
			updateSignificanceTest(result)
		},
		[updateSignificanceTest, runId],
	)

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = getConfidenceInterval(runId as string, nodeResponse)
			updateSignificanceTest(initialRun)
		},
		[updateSignificanceTest, runId],
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

export function useUpdateSignificanceTests(
	runId?: string,
): (significanceTest?: SignificanceTest) => void {
	const updateSignificanceTest = useSetSignificanceTest()

	return useCallback(
		(significanceTest?: SignificanceTest) => {
			updateSignificanceTest(prev => {
				const oldOnes = prev.filter(p => p.runId !== runId)
				if (!significanceTest) return oldOnes

				const existing = prev.find(
					p => p.runId === significanceTest.runId,
				) as SignificanceTest

				const newOne = {
					...existing,
					...significanceTest,
				}
				return [...oldOnes, newOne] as SignificanceTest[]
			})
		},
		[updateSignificanceTest, runId],
	)
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
