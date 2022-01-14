/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { getConfidenceOrchestrator } from '~classes'
import { NodeResponseStatus } from '~enums'
import { useDefaultRun } from '~hooks'
import {
	NodeResponse,
	SignificanceTest,
	SignificanceTestResponse,
} from '~interfaces'
import { useSetSignificanceTests } from '~state'
import {
	matchStatus,
	returnInitialConfidenceInterval,
	returnPercentage,
} from '~utils'

export const useRunConfidenceInterval = (): any => {
	const defaultRun = useDefaultRun()
	const updateSignificanceTests = useSetSignificanceTests(defaultRun?.id)

	const onUpdate = useCallback(
		(status: SignificanceTestResponse) => {
			if (matchStatus(status.runtimeStatus, NodeResponseStatus.Terminated)) {
				return updateSignificanceTests(undefined)
			}
			updateSignificanceTests(prev => {
				return {
					...(prev as SignificanceTest),
					simulation_completed: status.simulation_completed || 0,
					test_results: status.test_results,
					total_simulations: status.total_simulations || 0,
					status: status.runtimeStatus,
					percentage: returnPercentage(
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
			const initialRun = returnInitialConfidenceInterval(
				defaultRun?.id as string,
				nodeResponse,
			)
			updateSignificanceTests(initialRun)
		},
		[updateSignificanceTests, defaultRun],
	)

	const run = useCallback((): any => {
		return getConfidenceOrchestrator(onStart, onUpdate)
	}, [onStart, onUpdate])

	return run
}
