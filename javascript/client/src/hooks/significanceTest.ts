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
import { useCallback, useMemo } from 'react'

import { useDefaultRun } from '~hooks'
import { api } from '~resources'
import { useSetSignificanceTest, useSignificanceTest } from '~state'
import { getConfidenceInterval, percentage } from '~utils'

export function useRunSignificanceTest(): any {
	const defaultRun = useDefaultRun()
	const updateSignificanceTest = useUpdateSignificanceTests(defaultRun?.id)

	const onUpdate = useCallback(
		(status: SignificanceTestResponse) => {
			if (isStatus(status.runtimeStatus, NodeResponseStatus.Terminated)) {
				return updateSignificanceTest()
			}
			if (!defaultRun) return undefined
			const result = {
				runId: defaultRun.id,
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
		[defaultRun, updateSignificanceTest],
	)

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = getConfidenceInterval(
				defaultRun?.id as string,
				nodeResponse,
			)
			updateSignificanceTest(initialRun)
		},
		[updateSignificanceTest, defaultRun],
	)

	const run = useCallback((): any => {
		return getConfidenceOrchestrator(api, onStart, onUpdate)
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

export function useActualSignificanceTest(): Maybe<SignificanceTest> {
	const defaultRun = useDefaultRun()
	const significanceTest = useSignificanceTest()

	return useMemo(() => {
		if (!defaultRun) return undefined
		return significanceTest.find(x => x.runId === defaultRun.id)
	}, [defaultRun, significanceTest])
}
