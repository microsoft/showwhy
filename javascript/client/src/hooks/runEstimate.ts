/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	getEstimatorOrchestrator,
	Orchestrator,
	EstimateEffectStatusResponse,
	NodeResponse,
} from '@showwhy/api-client'
import {
	useRefutationLength,
	useUpdateActiveRunHistory,
	useUpdateNodeResponseActiveRunHistory,
} from '~hooks'
import { useConfidenceInterval } from '~state'
import type { RunStatus } from '~types'
import { getRunStatus } from '~utils'
import { api } from '~resources'

export function useRunEstimate(): () => Orchestrator<EstimateEffectStatusResponse> {
	const updateActive = useUpdateActiveRunHistory()
	const updateNodeResponse = useUpdateNodeResponseActiveRunHistory()

	const hasConfidenceInterval = useConfidenceInterval()
	const refutersLength = useRefutationLength()

	const onUpdate = useCallback(
		(status: EstimateEffectStatusResponse) => {
			const updatedStatus = getRunStatus(
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
		return getEstimatorOrchestrator(api, onStart, onUpdate, onComplete)
	}, [onUpdate, onComplete, onStart])

	return run
}
