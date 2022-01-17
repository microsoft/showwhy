/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { getEstimatorOrchestrator, Orchestrator } from '~classes'
import {
	useRefutationLength,
	useUpdateActiveRunHistory,
	useUpdateNodeResponseActiveRunHistory,
} from '~hooks'
import {
	EstimateEffectStatusResponse,
	NodeResponse,
	RunStatus,
} from '~interfaces'
import { useConfidenceInterval } from '~state'
import { returnStatus } from '~utils'

export function useRunEstimate(): () => Orchestrator<EstimateEffectStatusResponse> {
	const updateActive = useUpdateActiveRunHistory()
	const updateNodeResponse = useUpdateNodeResponseActiveRunHistory()

	const hasConfidenceInterval = useConfidenceInterval()
	const refutersLength = useRefutationLength()

	const onUpdate = useCallback(
		(status: EstimateEffectStatusResponse) => {
			const updatedStatus = returnStatus(
				status,
				hasConfidenceInterval,
				refutersLength,
			)

			updateActive(updatedStatus, status?.partial_results)
		},
		[updateActive, hasConfidenceInterval, refutersLength],
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
			updateNodeResponse(nodeResponse)
		},
		[updateNodeResponse],
	)

	const run = useCallback((): Orchestrator<EstimateEffectStatusResponse> => {
		return getEstimatorOrchestrator(onStart, onUpdate, onComplete)
	}, [onUpdate, onComplete])

	return run
}
