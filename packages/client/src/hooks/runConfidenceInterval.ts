/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useState, useEffect } from 'react'
import { ConfidenceInterval } from '~classes'
import { NodeResponseStatus } from '~enums'
import { useDefaultRun } from '~hooks'
import {
	NodeResponse,
	SignificanceTest,
	SignificanceTestResponse,
} from '~interfaces'
import { useSetSignificanceTests, useSignificanceTests } from '~state'
import {
	isStatusProcessing,
	matchStatus,
	returnInitialConfidenceInterval,
	returnPercentage,
} from '~utils'

export const useRunConfidenceInterval = (): any => {
	const [run, setRun] = useState<ConfidenceInterval>()
	const [isCanceled, setIsCanceled] = useState<boolean>(false)

	const defaultRun = useDefaultRun()
	const significanceTests = useSignificanceTests(defaultRun?.id)
	const updateSignificanceTests = useSetSignificanceTests(defaultRun?.id)

	useEffect(() => {
		if (
			!run &&
			significanceTests &&
			isStatusProcessing(significanceTests?.status as NodeResponseStatus)
		) {
			const newRun = new ConfidenceInterval(onStart, onUpdate)
			newRun.setOrchestratorResponse(significanceTests.nodeResponse)
			setRun(newRun)
		}
	}, [significanceTests, run, setRun])

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
			setIsCanceled(false)
			updateSignificanceTests(initialRun)
		},
		[updateSignificanceTests, defaultRun, setIsCanceled],
	)

	const runConfidenceInterval = useCallback(
		async (activeTasksIds: string[]) => {
			const newRun = new ConfidenceInterval(onStart, onUpdate)
			setRun(newRun)

			await newRun.execute(activeTasksIds)
		},
		[],
	)

	const cancelRun = useCallback(() => {
		setIsCanceled(true)
		run && run.cancel()
	}, [run, setIsCanceled])

	return { runConfidenceInterval, cancelRun, isCanceled }
}
