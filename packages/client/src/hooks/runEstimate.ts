/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { getEstimatorOrchestrator } from '~classes'
import {
	useRefutationLength,
	useUpdateActiveRunHistory,
	useUpdateAndDisableRunHistory,
} from '~hooks'
import {
	EstimateEffectStatusResponse,
	NodeResponse,
	RunStatus,
} from '~interfaces'
import {
	useConfidenceInterval,
	useRefutationType,
	useRunHistory,
	useSpecCount,
} from '~state'
import {
	returnInitialRunHistory,
	returnRefutationCount,
	returnStatus,
} from '~utils'

export const useRunEstimate = (): any => {
	const updateRunHistory = useUpdateAndDisableRunHistory()
	const updateActive = useUpdateActiveRunHistory()
	const specCount = useSpecCount()

	const refutationType = useRefutationType()
	const hasConfidenceInterval = useConfidenceInterval()
	const runHistory = useRunHistory()
	const totalRefuters = useRefutationLength()

	const totalRefutation = useMemo((): any => {
		return returnRefutationCount(specCount as number, totalRefuters)
	}, [specCount, totalRefuters])

	const onUpdate = useCallback(
		(status: EstimateEffectStatusResponse) => {
			const updatedStatus = returnStatus(
				status,
				hasConfidenceInterval,
				totalRefutation,
				specCount as number,
			)

			updateActive(updatedStatus, status?.partial_results)
		},
		[
			updateActive,
			updateRunHistory,
			hasConfidenceInterval,
			specCount,
			totalRefutation,
		],
	)

	const onComplete = useCallback(() => {
		const updatedStatus = {
			time: {
				end: new Date(),
			},
		} as RunStatus
		updateActive(updatedStatus)
	}, [updateActive])

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = returnInitialRunHistory(
				specCount as number,
				totalRefutation,
				hasConfidenceInterval,
				refutationType,
				runHistory.length,
				nodeResponse,
			)
			updateRunHistory(initialRun)
		},
		[
			updateRunHistory,
			hasConfidenceInterval,
			refutationType,
			specCount,
			runHistory,
			totalRefutation,
		],
	)

	const run = useCallback((): any => {
		return getEstimatorOrchestrator(onStart, onUpdate, onComplete)
	}, [onStart, onUpdate, onComplete])

	return run
}
