/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getConfidenceOrchestrator, isStatus } from '@showwhy/api-client'
import type {
	SignificanceTest,
	NodeResponse,
	SignificanceTestResponse,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback } from 'react'
import { useDefaultRun } from '~hooks'
import { api } from '~resources'
import { useSetSignificanceTests } from '~state'
import { getConfidenceInterval, percentage } from '~utils'

export function useRunConfidenceInterval(): any {
	const defaultRun = useDefaultRun()
	const updateSignificanceTests = useSetSignificanceTests(defaultRun?.id)

	const onUpdate = useCallback(
		(status: SignificanceTestResponse) => {
			if (isStatus(status.runtimeStatus, NodeResponseStatus.Terminated)) {
				return updateSignificanceTests(undefined)
			}
			updateSignificanceTests(prev => {
				return {
					...(prev as SignificanceTest),
					simulation_completed: status.simulation_completed || 0,
					test_results: status.test_results,
					total_simulations: status.total_simulations || 0,
					status: status.runtimeStatus,
					percentage: percentage(
						status?.simulation_completed || 0,
						status.total_simulations || 1,
					),
				} as SignificanceTest
			})
		},
		[updateSignificanceTests],
	)

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = getConfidenceInterval(
				defaultRun?.id as string,
				nodeResponse,
			)
			updateSignificanceTests(initialRun)
		},
		[updateSignificanceTests, defaultRun],
	)

	const run = useCallback((): any => {
		return getConfidenceOrchestrator(api, onStart, onUpdate)
	}, [onStart, onUpdate])

	return run
}
